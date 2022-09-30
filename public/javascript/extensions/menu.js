import { html } from 'uhtml';
import components from '../components';

export default update => html`
<nav>
  <ul>
    ${ components.map(({ label, path }) => html.for({ label, path })`
      <li><a onclick="${ () => update(path) }" class="${ path === window.location.pathname ? 'nav-active' : null }">${ label }</li>
    `) }
  </ul>
</nav>
`;