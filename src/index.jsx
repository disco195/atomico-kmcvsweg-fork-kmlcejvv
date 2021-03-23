import { c, useProp } from "atomico";
import md from "@atomico/markdown";

const style = /*css*/ `
  .markdown{
    font-size: 1rem;
  }
  .markdown > code{
    width: 100%;
    display: block;
    border-radius: 10px;
    padding: 20px;
    color: white;
    background: black;
  }

`;

function markdown() {
  let [count, setCount] = useProp("count");

  return (
    <host shadowDom>
      <style>{style}</style>
      <div class="markdown">
        {md`
        # Markdown ❤️ Js

        The parser transforms the code into virtualDOM.

        You can insert JS code easily ${(
          <button onclick={() => setCount(count + 1)}>
            Example this button with an <strong>{count}</strong> state
          </button>
        )}

        Please help me to support: 

        - [ ] Better code compression.
        - [ ] Associate template arguments to code blocks.
        - [ ] Nested lists.
        - [ ] Task lists.

        - [👉 Github](https://github.com/uppercod/markdown-inline)
        - [👉 Author UpperCod](https://twitter.com/uppercod)
      `}
      </div>
    </host>
  );
}

markdown.props = {
  count: {
    type: Number,
    reflect: true,
    value: 0,
  },
};

customElements.define("markdown-inline", c(markdown));
