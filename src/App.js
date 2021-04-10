import React from 'react';
import { TinaProvider, TinaCMS, useCMS, useForm, usePlugin } from 'tinacms';
import logo from './Icon.svg';
import './App.css';

function App() {
  const cms = new TinaCMS({
    sidebar: true,
  });
  return (
    <TinaProvider cms={cms}>
      <div className="App">
        <PageContent />
      </div>
    </TinaProvider>
  );
}

export default App;

function PageContent() {
  const cms = useCMS();
  const formConfig = {
    id: 'tina-tutorial-index',
    label: 'Edit Page',
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'body',
        label: 'Body',
        component: 'textarea',
      },
    ],
    loadInitialValues() {
      return fetch(
        'https://jsonplaceholder.typicode.com/posts/1'
      ).then((response) => response.json());
    },
    onSubmit(formData) {
      cms.alerts.info('Saving Content...')
      return fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        body: JSON.stringify({
          id: 1,
          title: formData.title,
          body: formData.body,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then((data) => {
          cms.alerts.success('Saved Content!');
          console.log(data);
        })
        .catch((e) => {
          cms.alerts.error('Error Saving Content');
          console.error(e);
        });
    },
  }

  // 3. Create the form
  const [editableData, form] = useForm(formConfig)

  // 4. Register it with the CMS
  usePlugin(form)

  return (
    <section className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {/**
       * 5. Render the `editableData` returned from `useForm`
       */}
      <h1>{editableData.title}</h1>
      <p>{editableData.body}</p>
      <EditButton />
    </section>
  );
}

function EditButton() {
  const cms = useCMS();
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
    </button>
  );
}
