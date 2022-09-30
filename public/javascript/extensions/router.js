import components from '../components';

async function update(path, history = false) {
  if (!history) {
    window.history.pushState(path, false, path);
  }
  console.log('thelog route path', path)

  // Path contain params, so need to break down the url to get only pathname
  const theURL = new URL(path, location)
  console.log('thelog route theURL', theURL)
  
  const { callback = () => {} } = components.find(component => component.path === theURL.pathname);
  await callback(update);
}

function initialize() {
  window.onpopstate = event => {
    console.log('thelog event', event)
    if (event && event.state) {
      update(event.state, true);
    }
  };
}

export { update, initialize };