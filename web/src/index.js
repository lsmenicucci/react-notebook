import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import bs from "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.min.css"

import { Editor, Node } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

import { createApp } from "petite-vue"


createApp({ text:"123hey" }).mount()


const sampleData = { list: [1,2,3], f: () => console.log("wawa")  }

const buildComponent = (name, html) => {
  class Component extends HTMLElement {
    connectedCallback() {
      this.innerHTML = html;

      this.children[0].setAttribute("v-scope", "{ text: 'abcd' }")
    }

  }

  return customElements.define(`ce-${name}`, Component);
}

const loadComponent = async name => {
  const htmlPath = `./components/${name}.html`
  const jsPath = `./components/${name}.js`

  const htmlRaw = await fetch(htmlPath).then(r => r.text()) 
  buildComponent(name, htmlRaw)  

  //const dataObj = await import("./components/list.js")
}

const ext = Node.create({
  name: "teste",
  group: 'block',
  content: 'inline',

  addNodeView() {
    return () => {
      const d = document.createElement("ce-card")
      const body = d.querySelector(".card-body")
  
      return { dom: d, contentDOM: body  }
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ["teste", HTMLAttributes, 0]
  },

  parseHTML() {
    return [{ tag: 'teste' }]
  },

})


loadComponent("card")

const e = new Editor({
  element: document.querySelector('#editor'),
  extensions: [StarterKit, ext],
  content: 'This is a card: <teste>pre content?</teste>',
})

