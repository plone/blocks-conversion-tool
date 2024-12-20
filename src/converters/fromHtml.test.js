import convertFromHTML from './fromHtml.js';

describe('convertFromHTML parsing html', () => {
  const html = `
  <p>Years have passed since the 2016 sprint at Penn State where a team of community members worked on a new theme and madly reorganized content on the Plone 5 version of plone.org. The site dates back to 2002 and the Plone 1 days, and the software and content had been upgraded in place over the years with only minor theme changes - to Plone 2 and 2.5, then Plone 3, then Plone 4, and finally Plone 4.3. It served us well, but because Plone 5 brought many changes, including a new out-of-the-box theme (Barceloneta), we mounted a major effort to refresh the design as well as upgrade the content and software.</p>
  <p>What was new then is now looking old, and the <a href="https://plone.org/community/communications-and-marketing">marketing team</a> has embarked on a modernization effort. The ultimate goal is to upgrade to Plone 6 and create a React-based theme using the new front end. But meanwhile we've been having a series of mini-sprints to improve what we have now.</p>
  <p>Our first major initiative was to improve the News section, which holds an amazing collection of content. Browsing it can take you back in time - to the <a href="https://plone.org/news/2002/plone-rc1-announce">Plone 1.0 RC1 release announcement</a> for example, or <a href="https://plone.org/news/2002/News%20Item%2C2002-03-09%2C1015704695057735977">Alan's 2002 thoughts on what Plone should be</a>, or <a href="https://plone.org/news/2006/plone-foundation-501c3">approval of the Plone Foundation as a 501(c)(3) organization</a>. It was already possible to <a href="https://plone.org/news/plone-news-by-year">browse news items by year</a>, but we thought categorization by topic would also be useful. So we tagged every news item, and now you can <a href="https://plone.org/news/plone-news-by-category">browse news items by category</a>. Fulvio Casali chronicled this effort in his 2020 Plone Conference talk <a href="https://www.youtube.com/watch?v=6OV0_E5sU5k">Oh the Places We've Been</a>!</p>
  <p>A not very attractive display of news items and listings was another issue. So we sketched out a cleaner look, with a standardized lead image aspect ratio and a more useful byline. Then the more technically adventurous members of the marketing team (Norbert, Fulvio, Érico) strapped on helmets and figured out how to make changes to the site's theme. You are looking at our initial improvements, and there's more to come.</p>
  <p>Our other major initiative is to move the contents of the plone.com site over to plone.org. Over the years plone.com became very difficult to maintain, so we have discontinued it. (Contact the marketing team if you need to retrieve any plone.com content.) With that in mind, we created a <a href="https://plone.org/what-is-plone">What is Plone?</a> section on plone.org which is oriented towards the plone.com audience. It is also a place for us to describe all the pieces of the Plone ecosystem and how they fit together.</p>
  <p>In addition to these bigger jobs we've been making lots of little improvements during our mini-sprints, including fixing bugs old and new as recorded on the <a href="https://github.com/plone/ploneorg.core/issues">plone.org issue tracker</a>.</p>
  <h2>Would you like to help with this effort?</h2>
  <p>We'd love to have you!</p>
  <ul>
  <li>Join our effort to <strong>promote Plone by publishing regular plone.org news items</strong> - successes, new developments, controversies, generally telling a broad audience what's happening in the Plone world</li>
  <li>Do you have design skills? We don't and we need <strong>help with design improvements</strong> and eventually a <strong>new theme for Plone 6</strong></li>
  <li>If you are a theming wizard please help us <strong>modernize the site styles</strong> - more 2021 and less 2016</li>
  <li>Show off Plone's built in search by creating a <strong>beautiful search results listing</strong></li>
  <li>Help us with our ongoing efforts to <strong>fix bugs</strong> and <strong>curate content</strong></li>
  <li>Help us <strong>migrate plone.org to Plone 6</strong></li>
  </ul>
  <p>Please <a href="mailto:marketing@plone.org?subject=Helping with plone.org">contact the marketing team</a> to get involved. Anyone with technical, design or content editor skills is welcome.</p>
  <p><strong> </strong></p>`;

  describe('with draftjs converter', () => {
    const result = convertFromHTML(html, 'draftjs');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(10);
    });

    test('will have a first block with text content', () => {
      const block = result[0];
      expect(block['@type']).toBe('text');
      const valueElement = block.text;
      expect(valueElement.blocks).toHaveLength(1);
      const firstBlock = valueElement.blocks[0];
      expect(firstBlock['text']).toContain(
        'Years have passed since the 2016 sprint at Penn State where a team of community members worked',
      );
      expect(firstBlock['type']).toBe('unstyled');
      expect(firstBlock['depth']).toBe(0);
    });
  });

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(10);
    });

    test('will have a first block with text content', () => {
      const block = result[0];
      expect(block['@type']).toBe('slate');
      expect(block.plaintext).toContain(
        'Years have passed since the 2016 sprint at Penn State where a team of community members worked',
      );
      const valueElement = block.value[0];
      expect(valueElement['type']).toBe('p');
      expect(valueElement['children'][0]['text']).toContain(
        'Years have passed since the 2016 sprint at Penn State where a team of community members worked',
      );
    });
  });
});

describe('convertFromHTML parsing html with images nested in h2', () => {
  const html = `
  <div>
    <h2 id="chrissy"><img src="https://plone.org/foundation/meetings/membership/2019-membership-meeting/nominations/img4_08594.jpg/@@images/7a07f0e5-0fd7-4366-a32d-6b033c8dfce7.jpeg" title="Chrissy Wainwright 2019" alt="Chrissy Wainwright 2019" class="image-right">Chrissy Wainwright</h2>
    <p><strong>President</strong>, (Springdale, Arkansas, USA)</p>
    <p>Chrissy started at Six Feet Up as a front-end developer building Plone themes and has since moved to the back-end doing Python development and Plone migrations. She has given talks and training classes at many Plone Symposia and Conferences. This is her seventh term on the board, second as President.</p>
    <hr>
    <h2 id="erico"><img src="https://plone.org/foundation/board/github.jpg/@@images/1135c449-bf22-4011-b128-ab50c62e03b1.jpeg" title="ericof" alt="ericof" class="image-right">Érico Andrei</h2>
    <p><strong>Vice President</strong>, (Berlin, DE)</p>
    <p>Érico Andrei worked for more than 10 years with content management projects using Plone. During that period he co-founded Simples Consultoria, hosted 2 Plone Symposiums, co-organized a Plone Conference and in 2011 he was PythonBrasil (local Pycon) chair. Currently CTO for a German startup. He still uses Plone and Python every day. This is Érico's sixth term on the board.</p>
    <hr>
  </div>
  `;

  describe('with draftjs converter', () => {
    const result = convertFromHTML(html, 'draftjs');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(10);
    });

    test('will have a first block with an image', () => {
      const block = result[0];
      expect(block['@type']).toBe('image');
      expect(block['align']).toBe('right');
      expect(block['alt']).toBe('Chrissy Wainwright 2019');
      expect(block['title']).toBe('Chrissy Wainwright 2019');
      expect(block['size']).toBe('m');
      expect(block['url']).toBe(
        'https://plone.org/foundation/meetings/membership/2019-membership-meeting/nominations/img4_08594.jpg',
      );
    });

    test('will have a second block with text content', () => {
      const block = result[1];
      expect(block['@type']).toBe('text');
      const valueElement = block.text;
      expect(valueElement.blocks).toHaveLength(1);
      const firstBlock = valueElement.blocks[0];
      expect(firstBlock['text']).toContain('Chrissy Wainwright');
      expect(firstBlock['type']).toBe('header-two');
      expect(firstBlock['depth']).toBe(0);
    });
  });

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(10);
    });

    test('will have a first block with an image', () => {
      const block = result[0];
      expect(block['@type']).toBe('image');
      expect(block['align']).toBe('right');
      expect(block['alt']).toBe('Chrissy Wainwright 2019');
      expect(block['title']).toBe('Chrissy Wainwright 2019');
      expect(block['size']).toBe('m');
      expect(block['url']).toBe(
        'https://plone.org/foundation/meetings/membership/2019-membership-meeting/nominations/img4_08594.jpg',
      );
    });

    test('will have a second block with text content', () => {
      const block = result[1];
      expect(block['@type']).toBe('slate');
      expect(block.plaintext).toContain('Chrissy Wainwright');
      const valueElement = block.value[0];
      expect(valueElement['type']).toBe('h2');
      expect(valueElement['children'][0]['text']).toContain(
        'Chrissy Wainwright',
      );
    });
  });
});

describe('convertFromHTML parsing html with definition lists', () => {
  const html = `
  <div>
    <dl>
    <dt>Problem A1: Injection</dt>
    <dd>How Plone handles this: This is usually found in connections with databases as SQL Injection. As Plone does not use a SQL based database this is not possible. The database that Plone uses is not vulnerable to injection as it uses a binary format that cannot have user data inserted.</dd>
    <dt>Problem A2: Broken Authentication and Session Management</dt>
    <dd>How Plone handles this: Plone authenticates users in its own database using a SSHA hash of their password. Using its modular authentication system Plone can also authenticate users against common authentication systems such as LDAP and SQL as well as any other system for which a plugin is available (Gmail, OpenID, etc.). After authentication, Plone creates a session using a SHA-256 hash of a secret stored on the server, the userid and the current time. This is based on the Apache auth_tkt cookie format, but with a more secure hash function. Secrets can be refreshed on a regular basis to add extra security where needed.</dd>
    <dt>Problem A3: Cross Site Scripting (XSS)</dt>
    <dd>How Plone handles this: Plone has strong filtering in place to make sure that no potentially malicious code can ever be entered into the system. All content that is inserted is stripped of malicious tags like <code>&lt;script&gt;</code>, <code>&lt;embed&gt;</code> and <code>&lt;object&gt;</code>, as well as removing all <code>&lt;form&gt;</code> related tags, stopping users from impersonating any kind of HTTP POST requests. On an infrastructure level, the template language used to create pages in Plone quotes all HTML by default, effectively preventing cross site scripting.</dd>
    </dl>
  </div>
  `;

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(1);
    });

    test('will have a block with the definition list', () => {
      const block = result[0];
      expect(block['@type']).toBe('slate');
      expect(block.plaintext).toContain('Problem A1: Injection');
      expect(block.plaintext).toContain(
        'Problem A3: Cross Site Scripting (XSS)',
      );
      expect(block['value'][0]['children']).toHaveLength(6);
    });

    test('will have the first definition in the list', () => {
      const definitionList = result[0].value[0];
      const term = definitionList.children[0];
      expect(term['type']).toBe('dt');
      expect(term['children'][0]['text']).toContain('Problem A1: Injection');
      const definition = definitionList.children[1];
      expect(definition['type']).toBe('dd');
      expect(definition['children'][0]['text']).toContain(
        'usually found in connections with databases as SQL Injection',
      );
    });
  });
});

describe('convertFromHTML parsing html with nested divs', () => {
  const html = `
  <div>
    <p><strong>The Plone Conference 2021 will be held as an online event on October 23 - 31, 2021. <br></strong></p>
    <p>The platform for this virtual event is <a href="https://loudswarm.com/" title="LoudSwarm">LoudSwarm</a>.</p>
    <p>The conference website can be found at <a href="https://2021.ploneconf.org/" title="Ploneconf 2021">https://2021.ploneconf.org/</a></p>
    <div class="intro-preliminary">
    <div>
      <p>Conference information (subject due to change):</p>
      <ul>
        <li>Training</li>
        <li>4 days of talks + 1 of open spaces -</li>
        <li>Sprint</li>
      </ul>
    </div>
    </div>
    <div class="cooked">
      <h3><strong>Important dates</strong></h3>
      <ul>
        <li><strong>Call for papers: Now open - <a href="https://docs.google.com/forms/d/1PAZwkO7GDNnSJLr_V6hvTCy6zK4j4PgxnTZDwuOQI1E/viewform?edit_requested=true" title="Submit talks">submit your talk now</a>!</strong></li>
        <li>Early bird registrations: <strong><a href="https://tickets.ploneconf.org/" title="Tickets">Get your tickets now</a></strong>!</li>
        <li>Regular registrations:&nbsp;To be announced</li>
      </ul>
    </div>
    <p><strong>&nbsp;</strong></p>
    <p><strong>Follow Plone and Plone Conference on Twitter <a href="https://twitter.com/plone" title="Plone Twitter">@plone</a> and <a href="https://twitter.com/ploneconf" title="Twitter">@ploneconf</a> and hastag #ploneconf2021</strong></p>
    <p><strong>Stay tuned for more information! </strong></p>
  </div>
  `;

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return an array of blocks', () => {
      expect(result).toHaveLength(7);
    });

    test('will have a paragraph with a nested p', () => {
      const block = result[0];
      expect(block['@type']).toBe('slate');
      expect(block.plaintext).toContain('The Plone Conference 2021 will be');
      // strong inside a p
      const valueElement = block.value[0];
      const strongElement = valueElement['children'][0];
      expect(strongElement['children'][0]['text']).toContain(
        'The Plone Conference 2021 will be',
      );
    });

    test('will have a paragraph with p and a ul', () => {
      const block = result[3];
      const slateSubTypes = Array.from(block.value)
        .map((item) => item['type'])
        .flat();
      expect(slateSubTypes).toHaveLength(7);
      expect(slateSubTypes[0]).toBe('p');
      expect(slateSubTypes[1]).toBe('p');
      expect(slateSubTypes[2]).toBe('p');
      expect(slateSubTypes[3]).toBe('p');
      expect(slateSubTypes[4]).toBe('ul');
      expect(slateSubTypes[5]).toBe('p');
      expect(slateSubTypes[6]).toBe('p');
    });
  });
});

describe('convertFromHTML parsing unwrapped text', () => {
  const html = 'text with an <b>inline element</b> and more text';

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return a block with the text in a paragraph', () => {
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual([
        {
          type: 'p',
          children: [
            { text: 'text with an ' },
            { type: 'strong', children: [{ text: 'inline element' }] },
            { text: ' and more text' },
          ],
        },
      ]);
    });
  });
});

describe('convertFromHTML parsing unwrapped text with blocks', () => {
  const html = 'text with a <div>block element</div> and more text';

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return 3 blocks with the text in paragraphs', () => {
      expect(result).toHaveLength(3);
      expect(result[0].value).toEqual([
        { type: 'p', children: [{ text: 'text with a ' }] },
      ]);
      expect(result[1].value).toEqual([
        { type: 'p', children: [{ text: 'block element' }] },
      ]);
      expect(result[2].value).toEqual([
        { type: 'p', children: [{ text: ' and more text' }] },
      ]);
    });
  });
});

describe('convertFromHTML parsing div with br tags', () => {
  const html = '<div><b>Foo</b> <br /><br />Bar</div>';

  describe('with slate converter', () => {
    const result = convertFromHTML(html, 'slate');

    test('will return a block with the text in a paragraph', () => {
      expect(result).toHaveLength(1);
      expect(result[0].value).toEqual([
        {
          type: 'p',
          children: [
            { type: 'strong', children: [{ text: 'Foo' }] },
            { text: '\n\nBar' },
          ],
        },
      ]);
    });
  });
});

describe('convertFromHTML parsing whitespace inside unknown tags', () => {
  const html = '<center>\n<strong>text</strong>\n</center>';

  test('returns valid result preserving the whitespace', () => {
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result[0].value).toEqual([
      { text: ' ' },
      { type: 'strong', children: [{ text: 'text' }] },
      { text: ' ' },
    ]);
  });
});

describe('convertFromHTML parsing image', () => {
  // https://github.com/plone/blocks-conversion-tool/issues/21

  test('on its own', () => {
    const html = '<img src="image.jpeg">';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a block element with another image', () => {
    const html = '<div><img src="image1.jpg"><img src="image2.jpg"></div>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image1.jpg',
      },
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image2.jpg',
      },
    ]);
  });

  test('inside a p element', () => {
    const html = '<p><img src="image.jpeg"></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a span element', () => {
    const html = '<p><span><img src="image.jpeg"></span></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a div element', () => {
    // https://github.com/plone/blocks-conversion-tool/issues/21#issuecomment-1455176066
    const html = '<div><img src="image.jpeg"></div>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a nested div element', () => {
    // https://github.com/plone/blocks-conversion-tool/issues/21#issuecomment-1455176066
    const html = '<div><div><img src="image.jpeg"></div></div>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a nested div element with line breaks', () => {
    const html = `<div>
    <div>
    <p><span><img src="image.jpeg"  /></span></p>
    </div>
    </div>
    `;

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      '@type': 'image',
      align: 'center',
      alt: '',
      size: 'l',
      title: '',
      url: 'image.jpeg',
    });
  });

  test('inside a nested span element containing valid text', () => {
    const html = '<p><span><img src="image.jpeg" />text</span></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      '@type': 'image',
      align: 'center',
      alt: '',
      size: 'l',
      title: '',
      url: 'image.jpeg',
    });
  });

  test('inside a nested span element, with a sibling containing valid text', () => {
    const html =
      '<p><span><img src="image.jpeg" /></span><span>text</span></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      '@type': 'image',
      align: 'center',
      alt: '',
      size: 'l',
      title: '',
      url: 'image.jpeg',
    });
  });

  test('inside a nested link element should add the href property', () => {
    const html =
      '<p><a href="https://plone.org"><img src="image.jpeg"></a></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'image',
        align: 'center',
        alt: '',
        href: [
          {
            '@id': 'https://plone.org',
            title: 'plone.org',
          },
        ],
        size: 'l',
        title: '',
        url: 'image.jpeg',
      },
    ]);
  });

  test('inside a table', () => {
    const html =
      '<table><tr><td><div><img src="image.jpeg" /></div></td></tr></table>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      '@type': 'image',
      align: 'center',
      alt: '',
      size: 'l',
      title: '',
      url: 'image.jpeg',
    });
  });
});

describe('convertFromHTML parsing nested tags', () => {
  test('with a span inside a link', () => {
    const html = '<a href="link"><span>text</span></a>';
    const result = convertFromHTML(html, 'slate');
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'text',
        value: [
          {
            type: 'link',
            data: { url: 'link', target: null, title: null },
            children: [{ text: 'text' }],
          },
        ],
      },
    ]);
  });
  test('with an image and without line breaks', () => {
    const html = `<div>
    <div><p><span><img src="image.jpg"  /></span></p></div>
    <p ><span><a href="link"><span><span><span>Text</span></span></span></a>, </span><a href="link"><span>text</span></a>, <a href="link"><span><span>text</span></span> </a></p>
    </div>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
  });
  test('with an image and with an additional line break', () => {
    const html = `<div>
    <div>
    <p><span><img src="image.jpg"  /></span></p>
    </div>
    <p ><span><a href="link"><span><span><span>Text</span></span></span></a>, </span><a href="link"><span>text</span></a>, <a href="link"><span><span>text</span></span> </a></p>
    </div>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
  });
  test('with paragraph, table and image blocks', () => {
    const html = `<p>
    <table>
    <tbody>
    <tr>
    <td>
    <div><img src="image.png" /></div>
    </td>
    </tr>
    </tbody>
    </table>
    </p>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result[0]['@type']).toBe('image');
  });
  test('with paragraph, table and image blocks', () => {
    const html = `<div>
    <div>
    <p>
    <table>
    <tbody>
    <tr>
    <td>
    <div><img src="image.png"/></div>
    </td>
    </tr>
    </tbody>
    </table>
    </p>
    </div>
    <p></p>
    </div>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result[0]['@type']).toBe('image');
  });
  test('with paragraph, table, image blocks, and other paragraph', () => {
    const html = `<div>
    <p>
    <table>
    <tbody>
    <tr>
    <td>
    <div><img src="image.png"/></div>
    </td>
    </tr>
    </tbody>
    </table>
    </p>
    <p></p>
    <p>A text</p>
    </div>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
    expect(result[0]['@type']).toBe('image');
    expect(result[1]['@type']).toBe('slate');
  });
  test('with paragraph, and text and image in table', () => {
    const html = `<p>
    <table>
    <tbody>
    <tr>
    <td>text in table<img src="image.png" /></td>
    </tr>
    </tbody>
    </table>
    </p>`;
    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(2);
    expect(result[0]['@type']).toBe('image');
    expect(result[1]['@type']).toBe('slateTable');
  });
});

describe('convertFromHTML parsing quote', () => {
  test('on its own', () => {
    const html =
      '<blockquote><p><strong>Callout text with bold</strong></p></blockquote>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'callout_block',
        color: 'default',
        icon: 'it-info-circle',
        style: 'base',
        text: [
          {
            children: [
              {
                children: [
                  {
                    text: 'Callout text with bold',
                  },
                ],
                type: 'strong',
              },
            ],
            type: 'p',
          },
        ],
        title: '',
      },
    ]);
  });
});

describe('convertFromHTML create callout_block block from quote tag', () => {
  test('on its own', () => {
    const html =
      '<blockquote><strong>Callout text with bold</strong></blockquote>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'callout_block',
        style: 'base',
        icon: 'it-info-circle',
        title: '',
        text: [
          {
            children: [
              {
                text: 'Callout text with bold',
              },
            ],
            type: 'strong',
          },
        ],
        color: 'default',
      },
    ]);
  });
});

describe('convertFromHTML create slate block with proper css classes', () => {
  test('on its own', () => {
    const html =
      '<p><a key="0" href="https://www.plone.org" dataelement="" class="btn btn-primary inline-link">xxx</a></p>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'xxx',
        value: [
          {
            children: [
              {
                children: [
                  {
                    text: 'xxx',
                  },
                ],
                data: {
                  target: null,
                  title: null,
                  url: 'https://www.plone.org',
                },
                styleName: 'btn btn-primary inline-link',
                type: 'link',
              },
            ],
            type: 'p',
          },
        ],
      },
    ]);
  });
});

describe('convertFromHTML create slate block with basic proper unordered list', () => {
  test('on its own', () => {
    const html = '<ul><li key=0>aaa</li><li key=1>bbb</li></ul>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'aaabbb',
        value: [
          {
            children: [
              {
                children: [
                  {
                    text: 'aaa',
                  },
                ],
                type: 'li',
              },
              {
                children: [
                  {
                    text: 'bbb',
                  },
                ],
                type: 'li',
              },
            ],
            type: 'ul',
          },
        ],
      },
    ]);
  });
});

describe('convertFromHTML create slate block with complex unordered list', () => {
  test('on its own', () => {
    const html =
      '<ul><li key=0><strong>aaa</strong></li> <li key=1><a key="0" href="http://www.plone.org" data-element="">bbb</a></li></ul>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'aaa bbb',
        value: [
          {
            children: [
              {
                children: [{ children: [{ text: 'aaa' }], type: 'strong' }],
                type: 'li',
              },
              {
                children: [
                  {
                    children: [{ text: 'bbb' }],
                    data: {
                      target: null,
                      title: null,
                      url: 'http://www.plone.org',
                    },
                    type: 'link',
                  },
                ],
                type: 'li',
              },
            ],
            type: 'ul',
          },
        ],
      },
    ]);
  });
});

describe('convertFromHTML create slate block with basic proper ordered list', () => {
  test('on its own', () => {
    const html = '<ol><li key=0>aaa</li><li key=1>bbb</li></ol>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'aaabbb',
        value: [
          {
            children: [
              {
                children: [
                  {
                    text: 'aaa',
                  },
                ],
                type: 'li',
              },
              {
                children: [
                  {
                    text: 'bbb',
                  },
                ],
                type: 'li',
              },
            ],
            type: 'ol',
          },
        ],
      },
    ]);
  });
});

describe('convertFromHTML create slate block with complex ordered list', () => {
  test('on its own', () => {
    const html =
      '<ol><li key=0><strong>aaa</strong></li> <li key=1><a key="0" href="http://www.plone.org" data-element="">bbb</a></li></ol>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'slate',
        plaintext: 'aaa bbb',
        value: [
          {
            children: [
              {
                children: [{ children: [{ text: 'aaa' }], type: 'strong' }],
                type: 'li',
              },
              {
                children: [
                  {
                    children: [{ text: 'bbb' }],
                    data: {
                      target: null,
                      title: null,
                      url: 'http://www.plone.org',
                    },
                    type: 'link',
                  },
                ],
                type: 'li',
              },
            ],
            type: 'ol',
          },
        ],
      },
    ]);
  });
});

describe('convertFromHTML create callout_block', () => {
  test('on its own', () => {
    const html = '<blockquote class="blockquote"><p>text</p></blockquote>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'callout_block',
        color: 'default',
        icon: 'it-info-circle',
        style: 'base',
        text: [
          {
            children: [
              {
                text: 'text',
              },
            ],
            type: 'p',
          },
        ],
        title: '',
      },
    ]);
  });
});

describe('convertFromHTML create slate block with blockquote simple', () => {
  test('on its own', () => {
    const html = '<blockquote>Testo</blockquote>';

    const result = convertFromHTML(html, 'slate');
    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        '@type': 'callout_block',
        style: 'base',
        icon: 'it-info-circle',
        title: '',
        text: [{ type: 'p', children: [{ text: 'Testo' }] }],
        color: 'default',
      },
    ]);
  });
});

// describe.only('prova', () => {
//   test('on its own', () => {
//     const html =
//       '<blockquote><p><strong>Trasporto delle persone con difficoltà motorie ai seggi<br /></strong>Il Comune di Cavriago, in collaborazione con l’Associazione <strong>“NOI CON VOI”</strong>, organizza il trasporto delle persone disabili mediante il pulmino adibito appositamente a tale servizio. Il servizio verrà effettuato nei seguenti orari:<strong>SABATO 8 GIUGNO dalle 15.00 alle 17.00<br />,DOMENICA 9 GIUGNO dalle 10.00 alle 12.00.<br /></strong>Il trasporto dovrà essere prenotato direttamente all’associazione  al numero <strong>333 5383663</strong> (Ines).</p></blockquote>';

//     const result = convertFromHTML(html, 'slate');
//     expect(result).toHaveLength(1);
//     expect(result).toEqual();
//   });
// });
