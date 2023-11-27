const Mustache = require('mustache');
const Handlebars = require("handlebars");
const Squirrelly = require('squirrelly')

const possibleTemplateParameterRegex = /\{\{(.*?)\}\}/g
const validParameterLabelRegex = /^[a-z][a-z0-9_]*$/

const extractParameterLabels = (templateBody) => {
  const seenLabels = new Set()
  const validLabels = []
  const invalidLabels = []
  let match = possibleTemplateParameterRegex.exec(templateBody)
  while (match != null) {
    // Example of matchedExpression: {{name}}
    // Example of capturingGroup: name
    // A template parameter label should be inclusive of "{{" and "}}" so that we don't have to micromanage
    // whether a parameter label needs "{{" and "}}" across the stack. Lodash's startCase function is able
    // to strip off leading "{{" and trailing "}}", so the rendered label would look good e.g. "Name".
    const [matchedExpression, capturingGroup] = match
    if (!seenLabels.has(capturingGroup)) {
      if (capturingGroup.match(validParameterLabelRegex)) {
        validLabels.push(matchedExpression)
      } else {
        invalidLabels.push(matchedExpression)
      }
    }
    seenLabels.add(matchedExpression)
    match = possibleTemplateParameterRegex.exec(templateBody)
  }
  return {
    validLabels,
    invalidLabels,
  }
}

const template = "{{title}} spends today {{calc}}"

const parameterLabels = extractParameterLabels(template)
console.log('extractParameterLabels: ', JSON.stringify(parameterLabels))

const view = {
  title: "{{title}}",
  calc: () => ( 2 + 4 )
};

const output = Mustache.render(template, view);
console.log('Mustache: ', output)

const render = Handlebars.compile(template, { strict: true });
console.log('Handlebars: ', render(view));

// https://github.com/squirrellyjs/squirrelly/issues/218
const rendered = Squirrelly.render(template, view, { useWith: true })
console.log('Squirrelly: ', rendered)
