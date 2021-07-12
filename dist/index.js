/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 125:
/***/ ((module) => {

module.exports = eval("require")("@octokit/graphql");


/***/ }),

/***/ 900:
/***/ ((module) => {

module.exports = eval("require")("actions-toolkit");


/***/ }),

/***/ 536:
/***/ ((module) => {

module.exports = eval("require")("moment");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(396)
const { Toolkit } = __nccwpck_require__(900)
const { graphql } = __nccwpck_require__(125)
const moment = __nccwpck_require__(536)

const main = async () => {
  const authToken = "token " + process.env.DISCUSSIONS_TOKEN

  const repository = await getRepositoryData(authToken)
  const discussionBody = await buildDiscussionBody()
  const discussionTitle = buildDiscussionTitle()

  const categoryName = core.getInput("category") || "General"
  const category = repository.discussionCategories.nodes.find(c => c.name === categoryName)

  await createDiscussion(authToken, discussionBody, discussionTitle, repository.id, category.id)
}

const getRepositoryData = async (authToken) => {
  core.debug(`Querying repository ${process.env.GITHUB_REPOSITORY}`)
  const repositoryArray = process.env.GITHUB_REPOSITORY.split("/")

  const { repository } = await graphql(
    `
      query repositoryId($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
          discussionCategories(first: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
    `,
    {
      owner: repositoryArray[0],
      name: repositoryArray[1],
      headers: {
        authorization: authToken,
        "GraphQL-Features": "discussions_api",
      },
    }
  )

  return repository
}

const readTemplateFile = async () => {
  const template = core.getInput("filename") || "./.github/DISCUSSION_TEMPLATE.md"

  core.debug(`Reading template file: ${template}`)
  const tools = new Toolkit()
  const content = await tools.readFile(template)
  return content
}

const buildDiscussionBody = async () => {
  core.debug("discussion-body");
  const discussionBody = core.getInput("discussion-body");
  if(discussionBody) {
    return discussionBody;
  } else {
    return await readTemplateFile();
  }
}

const buildDiscussionTitle = () => {
  const titleText = core.getInput("title")

  if (core.getInput("title-date") === "true") {
    const date = moment().format("dddd, MMMM Do, YYYY")
    return `${titleText} ${date}`
  } else {
    return titleText
  }
}

const createDiscussion = async (authToken, body, title, repositoryId, categoryId) => {
  core.debug(`Creating discussion ${title}`)
  await graphql(
    `
      mutation createDiscussion($input: CreateDiscussionInput!) {
        createDiscussion(input: $input) {
          discussion {
            url
          }
        }
      }
    `,
    {
      input: {
        body: body,
        title: title,
        repositoryId: repositoryId,
        categoryId: categoryId,
      },
      headers: {
        authorization: authToken,
        "GraphQL-Features": "discussions_api",
      },
    }
  )
}

main().catch(err => core.setFailed(err.message))

})();

module.exports = __webpack_exports__;
/******/ })()
;