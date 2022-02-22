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
      expect(result).toHaveLength(11);
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
      expect(result).toHaveLength(11);
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
