// compare different implementations
// import draftToHtml from 'draftjs-to-html';
// import {stateToHTML} from 'draft-js-export-html';
// import { convertToHTML } from 'draft-convert';
import jsdom from 'jsdom';
import redraft from 'redraft';
// import React from 'react';
// import { connect } from 'react-redux';
// import { isEmpty } from 'lodash';
import pkg from 'lodash';
const { isEmpty } = pkg;

const { JSDOM } = jsdom;

const dom = new JSDOM();
const DOMParser = dom.window.DOMParser;
const parser = new DOMParser();

// import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

// from draft-js/utils/helpers
// to render to a plain string we need to be sure all the arrays are joined after render
const joinRecursively = (array) =>
  array
    ? array
        .map((child) => {
          if (Array.isArray(child)) {
            return joinRecursively(child);
          }
          return child.replace('\n', '<br />');
        })
        .filter((x) => x.length > 0)
        .join('')
    : '';

// https://www.npmjs.com/package/redraft
const convertWithRedraft = (input) => {
  const raw = redraft.default(input, renderers, options);
  const html = joinRecursively(raw);
  return html;
};

// https://www.npmjs.com/package/draftjs-to-html
// const convertWithDraftToHtml = (input) => {
//   const html = draftToHtml(
//     input,
//     // hashtagConfig,
//     // directional,
//     // customEntityTransform
//   );
//   return html;
// };

const styles = {
  code: 'background-color: rgba(0, 0, 0, 0.5); font-family: "Inconsolata", "Menlo", "Consolas", monospace; font-size: 16; padding: 2',
  // {
  //   backgroundColor: 'rgba(0, 0, 0, 0.05)',
  //   fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  //   fontSize: 16,
  //   padding: 2,
  // },
  // codeBlock: {
  //   backgroundColor: 'rgba(0, 0, 0, 0.05)',
  //   fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  //   fontSize: 16,
  //   padding: 20,
  // },
};

const addBreaklinesInline = (children) => {
  if (typeof children[0] == 'string') {
    const s = children[0];
    if (s.split('\n').length > 1) {
      return s
        .split('\n')
        .map((child, index) => (child?.length > 0 ? `${child}<br />` : child))
        .filter((x) => x.length)
        .join('');
    }
  }
  return joinRecursively(children);
};

// Inline (not block) styles
const inline = {
  BOLD: (children, { key }) =>
    `<strong>${addBreaklinesInline(children)}</strong>`,
  ITALIC: (children, { key }) => `<em>${addBreaklinesInline(children)}</em>`,
  UNDERLINE: (children, { key }) => `<u>${addBreaklinesInline(children)}</u>`,
  CODE: (children, { key }) =>
    `<span style="${styles.code}">${addBreaklinesInline(children)}</u>`,

  // custom
  TEXT_LARGER: (children, { key }) =>
    `<span class="text-larger">${addBreaklinesInline(children)}</span>`,
};

// const addBreaklines = (children) =>
//   children.map((child) => {
//     return child[1].map((child) => [`${child}<br />`]);
//   });

const splitBySoftLines = (children) =>
  children.map((child) => {
    return child.map((item) => {
      if (Array.isArray(item)) {
        return item[0].split('\n');
      }
      return item;
    });
  });

// // splitSoftLines for <li> tag
const splitSoftLinesOfLists = (children) =>
  children
    .map((child, index) => {
      let html = `<li key=${index}>`;
      child.forEach((subchild) => {
        if (Array.isArray(subchild)) {
          subchild.forEach((subchildren) => {
            if (typeof subchildren === 'string') {
              const last = subchildren.split('\n').length - 1;
              html += subchildren.split('\n').map((item, index) => {
                return item;
              });
            } else {
              return subchildren;
            }
          });
        } else {
          html += subchild;
        }
      });
      html += '</li>';
      return html;
      return `<li key=${index}>
         {child.map((subchild) => {
           if (Array.isArray(subchild)) {
             return subchild.map((subchildren) => {
               if (typeof subchildren === 'string') {
                 const last = subchildren.split('\n').length - 1;
                 return subchildren.split('\n').map((item, index) => (
                   <React.Fragment key={index}>
                     {item}
                     {index !== last && <br />}
                   </React.Fragment>
                 ));
               } else {
                 return subchildren;
               }
             });
           } else {
             return subchild;
           }
         })}
       </li>`;
      // return (
      //   <li key={index}>
      //     {child.map((subchild) => {
      //       if (Array.isArray(subchild)) {
      //         return subchild.map((subchildren) => {
      //           if (typeof subchildren === 'string') {
      //             const last = subchildren.split('\n').length - 1;
      //             return subchildren.split('\n').map((item, index) => (
      //               <React.Fragment key={index}>
      //                 {item}
      //                 {index !== last && <br />}
      //               </React.Fragment>
      //             ));
      //           } else {
      //             return subchildren;
      //           }
      //         });
      //       } else {
      //         return subchild;
      //       }
      //     })}
      //   </li>
      // );
    })
    .join(' ');

// // Returns how the default lists should be rendered
const getList =
  (ordered) =>
  (children, { depth, keys }) => {
    let liList = splitSoftLinesOfLists(children);
    return ordered ? `<ol>${liList}</ol>` : `<ul>${liList}</ul>`;
  };
// ordered ? (
//   <ol key={keys[0]} keys={keys} depth={depth}>
//     {splitSoftLinesOfLists(children)}
//   </ol>
// ) : (
//   <ul key={keys[0]} keys={keys} depth={depth}>
//     {splitSoftLinesOfLists(children)}
//   </ul>
// );

// // Special function to deal with list clones
// /*const getSpecialList = type => (children, { depth, keys }) => (
//   <ul key={keys[0]} keys={keys} depth={depth} className={type}>
//     {children.map((child, i) => (
//       <li key={keys[i]} className={`${type}-item`}>
//         {child}
//       </li>
//     ))}
//   </ul>
// );
// */

// // Original recommended way to deal with atomics, this does not work with IMAGE
// // const getAtomic = (children, { data, keys }) =>
// //   data.map((item, i) => <div key={keys[i]} {...data[i]} />);

const processChildren = (children, keys) => {
  const processedChildren = children.map((chunks) =>
    chunks.map((child, index) => {
      if (Array.isArray(child)) {
        // If it's empty is a blank paragraph, we want to add a <br /> in it
        if (isEmpty(child)) {
          return `<br key=${index} />`;
        }
        return child.map((subchild, index) => {
          if (typeof subchild === 'string') {
            const last = subchild.split('\n').length - 1;
            return subchild
              .split('\n')
              .map((item, index) => `${item}${index !== last ? '<br />' : ''}`);
          } else {
            return isEmpty(subchild) ? '<br />' : subchild;
          }
        });
      } else {
        return child;
      }
    }),
  );
  return processedChildren.map((chunk) =>
    chunk ? `<p>${joinRecursively(chunk)}</p>` : '',
  );
};

// /**
//  * Note that children can be maped to render a list or do other cool stuff
//  */
const blocks = {
  unstyled: (children, { keys }) => {
    return processChildren(children, keys);
  },
  //   atomic: (children) => children[0],
  blockquote: (children) =>
    children.map(
      (child, i) =>
        `<blockquote class="blockquote">${joinRecursively(child)}</blockquote>`,
    ),
  'header-one': (children, { keys }) =>
    children.map((child, i) => `<h1>${joinRecursively(child)}</h1>`),
  'header-two': (children, { keys }) =>
    children.map(
      // (child, i) => `<h2 id=${keys[i]} key=${keys[i]}>${joinRecursively(child)}</h2>`,
      // (child) => `<h2>${processChildren(child, keys)}</h2>`,
      (child) => `<h2>${joinRecursively(child)}</h2>`,
    ),
  'header-three': (children, { keys }) =>
    children.map((child, i) => `<h3>${joinRecursively(child)}</h3>`),
  'header-four': (children, { keys }) =>
    children.map((child, i) => `<h4>${joinRecursively(child)}</h4>`),
  'header-five': (children, { keys }) =>
    children.map((child, i) => `<h5>${joinRecursively(child)}</h5>`),
  'header-six': (children, { keys }) =>
    children.map((child, i) => `<h6>${joinRecursively(child)}</h6>`),
  callout: (children, { keys }) =>
    children.map(
      (child, i) => `<blockquote><p>${joinRecursively(child)}</p></blockquote>`,
    ),
  'callout-bg': (children, { keys }) =>
    children.map(
      (child, i) => `<blockquote><p>${joinRecursively(child)}</p></blockquote>`,
    ),
  buttons: (children, { keys }) => {
    const data = children.map((child, i) => {
      let html = child.flat().filter((x) => x !== undefined);
      const tag = parser.parseFromString(html.join(''), 'text/html');

      tag.body.childNodes.forEach((node) => {
        if (node.getAttribute) {
          let css_class = node.getAttribute('class') || '';
          css_class += 'btn btn-primary inline-link';
          node.setAttribute('class', css_class);
        }
      });
      return tag.body.innerHTML;
    });
    return `<p>${data.join('<br />')}</p>`;
  },
  //   'code-block': (children, { keys }) => (
  //     <pre key={keys[0]} style={styles.codeBlock}>
  //       {addBreaklines(children)}
  //     </pre>
  //   ),
  'unordered-list-item': getList(),
  'ordered-list-item': getList(true),
  //   callout: (children, { keys }) =>
  //     children.map((child, i) => (
  //       <p key={keys[i]} className="callout">
  //         {child}
  //       </p>
  //     )),
};

// const LinkEntity = connect((state) => ({
//   token: state.userSession.token,
// }))(({ token, key, url, target, targetUrl, download, children }) => {
//   const to = token ? url : targetUrl || url;

//   return (
//     <a
//       href={to}
//       openLinkInNewTab={target === '_blank' || undefined}
//       download={download}
//     >
//       {children}
//     </a>
//   );
// });

// const x = {
//   '@type': 'slate',
//   'plaintext': 'Consulta la pagina dedicata per visualizzare la diretta streaming ',
//   'value': [
//     {'children': [
//       {'text': 'Consulta la pagina dedicata per visualizzare la diretta '},
//       {'type': 'link', 'data': {'url': 'https://yioutube.com', 'dataElement': '', 'enhanced_link_infos': None}, 'children': [{'text': 'streaming'}]}, {'text': ' '}], 'type': 'p'}]}

//   // [{'@type': 'text', 'text': {'blocks': [{'data': {}, 'depth': 0, 'entityRanges': [{'key': 0, 'length': 9, 'offset': 56}], 'inlineStyleRanges': [{'length': 9, 'offset': 56, 'style': 'BOLD'}], 'key': 'be3v4', 'text': 'Consulta la pagina dedicata per visualizzare la diretta streaming ', 'type': 'unstyled'}], 'entityMap': {'0': {'data': {'url': 'http://www.youtube.com/channel/UC9U01Wc_5BheD-TY2e9Pnlw'}, 'mutability': 'MUTABLE', 'type': 'LINK'}}}}]
// // > /home/mauro/Work/IO-COMUNE/iocomune.buildout/scripts/get_draft_blocks.py(23)convert_to_slatejs()
// // -> res = requests.post('http://localhost:5000/draftjs', json={"draftjs": blocks, "converter": "slate"})
// // (Pdb) c
// // --- More than one block for http://nohost/Plone/amministrazione/organi-di-governo/consiglio-comunale/consiglio-comunale-in-diretta d14d442f-a16f-4f43-89cd-26daee169eff
// // [{'@type': 'slate', 'value': [{'type': 'p', 'children': [{'text': 'Consulta la pagina dedicata per visualizzare la diretta '}]}], 'plaintext': 'Consulta la pagina dedicata per visualizzare la diretta '}]

// const y = [
//    {
//      "@type": "slate",
//      "plaintext": "Consulta la pagina dedicata per visualizzare la diretta ",
//      "value":  [
//         {
//          "children": [
//            {
//              "text": "Consulta la pagina dedicata per visualizzare la diretta ",
//            },
//          ],
//          "type": "p",
//        },
//      ],
//    },
//    {
//      "@type": "slate",
//      "plaintext": "streaming",
//      "value": [
//        {
//          "children": [
//            {
//              "children": [
//                {
//                  "text": "streaming",
//                },
//              ],
//              "type": "strong",
//            },
//          ],
//          "data": {
//            "target": null,
//            "title": null,
//            "url": "http://www.youtube.com/channel/UC9U01Wc_5BheD-TY2e9Pnlw",
//          },
//          "type": "link",
//        },
//      ],
//    },
//  ]

const entities = {
  LINK: (children, props, { key }) => {
    return `<a key="${key}" href="${props.url}" data-element="${
      props.dataElement || ''
    }">${joinRecursively(children)}</a>`;
  },

  //   IMAGE: (children, entity, { key }) => (
  //     <img key={key} src={entity.src} alt={entity.alt} />
  //   ),
};

const options = {
  cleanup: false,
  joinOutput: false,
};

const renderers = {
  inline,
  blocks,
  entities,
};

export default convertWithRedraft;
// export default convertWithDraftToHtml;
