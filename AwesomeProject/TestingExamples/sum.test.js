const Article = require('./sum');
const fetch = require('node-fetch');

jest.mock('node-fetch');

test('Testing Articles',() => {
  const artObj = new Article("JavaScript");
  const data = {
    json: () => ({
      batchcomplete: '',
      query: {
        pages: {
          '9845': {
            pageid: 9845,
            ns: 0,
            title: 'JavaScript',
            contentmodel: 'wikitext',
            pagelanguage: 'en',
            pagelanguagehtmlcode: 'en',
            pagelanguagedir: 'ltr',
            touched: '2021-04-16T15:06:33Z',
            lastrevid: 1017870878,
            length: 72024
          }
        }
      }
    })
  };
  fetch.mockResolvedValue(data);

  const result = artObj.getLanguage();
  expect(result).toBe('en');

});