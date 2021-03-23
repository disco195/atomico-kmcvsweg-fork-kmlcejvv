function isEqualArray(before,after){let length=before.length;if(length!==after.length)return false;for(let i=0;i<length;i++){if(before[i]!==after[i])return false}return true}const isFunction=value=>typeof value=="function";const isObject=value=>typeof value=="object";const Any=null;const TRUE_VALUES=[true,1,"","1","true"];function setPrototype(proto,prop,schema,attrs,values){let{type:type,reflect:reflect,event:event,value:value,attr:attr=getAttr(prop)}=isObject(schema)&&schema!=Any?schema:{type:schema};let isCallable=!(type==Function||type==Any);Object.defineProperty(proto,prop,{set(newValue){let oldValue=this[prop];let{error:error,value:value}=filterValue(type,isCallable&&isFunction(newValue)?newValue(oldValue):newValue);if(error&&value!=null){throw {message:`The value defined for prop '${prop}' must be of type '${type.name}'`,value:value,target:this}}if(oldValue==value)return;this._props[prop]=value;this.update();if(event)dispatchEvent(this,event);this.updated.then(()=>{if(reflect){this._ignoreAttr=attr;reflectValue(this,type,attr,this[prop]);this._ignoreAttr=null;}});},get(){return this._props[prop]}});if(value!=null){values[prop]=value;}attrs[attr]=prop;}const dispatchEvent=(node,{type:type,base:base=CustomEvent,...eventInit})=>node.dispatchEvent(new base(type,eventInit));const getAttr=prop=>prop.replace(/([A-Z])/g,"-$1").toLowerCase();const reflectValue=(context,type,attr,value)=>value==null||type==Boolean&&!value?context.removeAttribute(attr):context.setAttribute(attr,isObject(value)?JSON.stringify(value):type==Boolean?"":value);function filterValue(type,value){if(type==Any)return {value:value};try{if(type==Boolean){value=TRUE_VALUES.includes(value);}else if(typeof value=="string"){value=type==Number?Number(value):type==Object||type==Array?JSON.parse(value):value;}if({}.toString.call(value)==`[object ${type.name}]`){return {value:value,error:type==Number&&Number.isNaN(value)}}}catch(e){}return {value:value,error:true}}let HOOK_CURRENT_REF;let HOOK_CURRENT_KEY;function useHost(){return useHook((state={current:HOOK_CURRENT_REF.host})=>state)}function useHook(render,rendered,collector){return HOOK_CURRENT_REF.use(render,rendered,collector)}function useRender(){return HOOK_CURRENT_REF.render}function createHooks(render,host){let hooks={};let ref={use:use,host:host,render:render};function use(render,cleanLayoutEffect,cleanEffect){let index=HOOK_CURRENT_KEY++;hooks[index]=[render(hooks[index]?hooks[index][0]:void 0),cleanLayoutEffect,cleanEffect];return hooks[index][0]}function cleanEffectsType(type,unmounted){for(let index in hooks){let hook=hooks[index];if(hook[type])hook[0]=hook[type](hook[0],unmounted);}}function load(callback){HOOK_CURRENT_KEY=0;HOOK_CURRENT_REF=ref;let value;try{value=callback();}finally{HOOK_CURRENT_REF=null;}return value}function cleanEffects(unmounted){cleanEffectsType(1,unmounted);return ()=>{cleanEffectsType(2,unmounted);if(unmounted)hooks={};}}return {load:load,cleanEffects:cleanEffects}}const FROM_PROP={id:1,className:1,checked:1,value:1,selected:1};const WITH_ATTR={list:1,type:1,size:1,form:1,width:1,height:1,src:1};const EMPTY_PROPS={};const EMPTY_CHILDREN=[];const TYPE_TEXT=3;const $=document;const vdom=Symbol();const KEY=Symbol();const ID=Symbol();function h(type,p,...argsChildren){let props=p||EMPTY_PROPS;let{children:children}=props;children=flat(children!=null?Array.isArray(children)?children:[children]:argsChildren,type=="style");if(!children.length){children=EMPTY_CHILDREN;}return {vdom:vdom,type:type,props:props,children:children,key:props.key,shadow:props.shadowDom,raw:type instanceof Node}}function render(vnode,node,id=ID,isSvg){let isNewNode;if(node&&node[id]&&node[id].vnode==vnode)return node;if(vnode&&vnode.type&&vnode.vdom!=vdom)return node;if(vnode!=null||!node){isSvg=isSvg||vnode.type=="svg";isNewNode=vnode.type!="host"&&(vnode.raw?node!=vnode.type:node?node.localName!=vnode.type:!node);if(isNewNode){let nextNode;if(vnode.type!=null){nextNode=vnode.raw?vnode.type:isSvg?$.createElementNS("http://www.w3.org/2000/svg",vnode.type):$.createElement(vnode.type,vnode.is?{is:vnode.is}:undefined);}else {return $.createTextNode(vnode+"")}node=nextNode;}}if(node.nodeType==TYPE_TEXT){if(!vnode.raw){let text=vnode+"";if(node.data!=text){node.data=text||"";}}return node}let oldVNode=node[id]?node[id].vnode:EMPTY_PROPS;let oldVnodeProps=oldVNode.props||EMPTY_PROPS;let oldVnodeChildren=oldVNode.children||EMPTY_CHILDREN;let handlers=isNewNode||!node[id]?{}:node[id].handlers;let childNodes=node[id]&&node[id].childNodes;if(vnode.shadow){if(!node.shadowRoot){node.attachShadow({mode:"open"});}}if(vnode.props!=oldVnodeProps){diffProps(node,oldVnodeProps,vnode.props,handlers,isSvg);}if(vnode.children!=oldVnodeChildren){let nextParent=vnode.shadow?node.shadowRoot:node;childNodes=renderChildren(vnode.children,childNodes||[],nextParent,id,isSvg&&vnode.type=="foreignObject"?false:isSvg);}node[id]={vnode:vnode,handlers:handlers,childNodes:childNodes};return node}function renderChildren(children,childNodes,parent,id,isSvg){let keyes=children._;let childrenLenght=children.length;let childNodesLength=childNodes.length;let index=keyes?0:childNodesLength>childrenLenght?childrenLenght:childNodesLength;let nextChildNodes=[];let fragmentMark=childNodes[id];if(!fragmentMark){fragmentMark=parent.appendChild($.createTextNode(""));}nextChildNodes[id]=fragmentMark;for(;index<childNodesLength;index++){let childNode=childNodes[index];if(keyes){let key=childNode[KEY];if(keyes.has(key)){keyes.set(key,childNode);continue}}childNodes.splice(index,1);index--;childNodesLength--;childNode.remove();}for(let i=0;i<childrenLenght;i++){let child=children[i];let indexChildNode=childNodes[i];let key=keyes?child.key:i;let childNode=keyes?keyes.get(key):indexChildNode;if(keyes&&childNode){if(childNode!=indexChildNode){parent.insertBefore(childNode,indexChildNode);}}if(keyes&&child.key==null)continue;let nextChildNode=render(child,childNode,id,isSvg);if(!childNode){parent.insertBefore(nextChildNode,childNodes[i]||fragmentMark);}else if(nextChildNode!=childNode){parent.replaceChild(nextChildNode,childNode);}nextChildNodes.push(nextChildNode);}return nextChildNodes}function diffProps(node,props,nextProps,handlers,isSvg){for(let key in props){if(!(key in nextProps)){setProperty(node,key,props[key],null,isSvg,handlers);}}for(let key in nextProps){setProperty(node,key,props[key],nextProps[key],isSvg,handlers);}}function setProperty(node,key,prevValue,nextValue,isSvg,handlers){key=key=="class"&&!isSvg?"className":key;prevValue=prevValue==null?null:prevValue;nextValue=nextValue==null?null:nextValue;if(key in node&&FROM_PROP[key]){prevValue=node[key];}if(nextValue===prevValue||key=="shadowDom"||key=="children"||key[0]=="_")return;if(key[0]=="o"&&key[1]=="n"&&(isFunction(nextValue)||isFunction(prevValue))){setEvent(node,key.slice(2),nextValue,handlers);}else if(key=="key"){node[KEY]=nextValue;}else if(key=="ref"){if(nextValue)nextValue.current=node;}else if(key=="style"){let style=node.style;prevValue=prevValue||"";nextValue=nextValue||"";let prevIsObject=isObject(prevValue);let nextIsObject=isObject(nextValue);if(prevIsObject){for(let key in prevValue){if(nextIsObject){if(!(key in nextValue))setPropertyStyle(style,key,null);}else {break}}}if(nextIsObject){for(let key in nextValue){let value=nextValue[key];if(prevIsObject&&prevValue[key]===value)continue;setPropertyStyle(style,key,value);}}else {style.cssText=nextValue;}}else {if(!isSvg&&!WITH_ATTR[key]&&key in node||isFunction(nextValue)||isFunction(prevValue)){node[key]=nextValue==null?"":nextValue;}else if(nextValue==null){node.removeAttribute(key);}else {node.setAttribute(key,isObject(nextValue)?JSON.stringify(nextValue):nextValue);}}}function setEvent(node,type,nextHandler,handlers){if(!handlers.handleEvent){handlers.handleEvent=event=>handlers[event.type].call(node,event);}if(nextHandler){if(!handlers[type]){node.addEventListener(type,handlers);}handlers[type]=nextHandler;}else {if(handlers[type]){node.removeEventListener(type,handlers);delete handlers[type];}}}function setPropertyStyle(style,key,value){let method="setProperty";if(value==null){method="removeProperty";value=null;}if(~key.indexOf("-")){style[method](key,value);}else {style[key]=value;}}function flat(children,saniate,map=[]){for(let i=0;i<children.length;i++){let child=children[i];if(child){if(Array.isArray(child)){flat(child,saniate,map);continue}if(child.key!=null){if(!map._)map._=new Map;map._.set(child.key,0);}}let type=typeof child;child=child==null||type=="boolean"||type=="function"||type=="object"&&(child.vdom!=vdom||saniate)?"":child;if(saniate){map[0]=(map[0]||"")+child;}else {map.push(child);}}return map}async function setup(context,component){let symbolId=Symbol();let hooks=createHooks(()=>context.update(),context);let prevent;context.symbolId=symbolId;context.mounted=new Promise(resolve=>context.mount=resolve);context.unmounted=new Promise(resolve=>context.unmount=resolve);const loadComponent=()=>component({...context._props});context.update=async()=>{if(!prevent){prevent=true;let resolveUpdate;context.updated=new Promise(resolve=>resolveUpdate=resolve).then(cleanEffect=>cleanEffect());await context.mounted;render(hooks.load(loadComponent),context,symbolId);prevent=false;resolveUpdate(hooks.cleanEffects());}};await context.unmounted;hooks.cleanEffects(true)();}function c(component,Base=HTMLElement){let attrs={};let values={};let{props:props}=component;class Element extends Base{constructor(){super();this._props={};setup(this,component);for(let prop in values)this[prop]=values[prop];this.update();}connectedCallback(){this.mount();}disconnectedCallback(){this.unmount();}attributeChangedCallback(attr,oldValue,value){if(attr===this._ignoreAttr||oldValue===value)return;this[attrs[attr]]=value;}}for(let prop in props){setPrototype(Element.prototype,prop,props[prop],attrs,values);}Element.observedAttributes=Object.keys(attrs);return Element}let createEffect=type=>(currentEffect,currentArgs)=>{let effect=([collector,args],unmounted)=>{if(unmounted){if(isFunction(collector))collector();}else {return [collector?collector:currentEffect(args),args]}};useHook(([collector,args]=[])=>{if(args||!args){if(args&&isEqualArray(args,currentArgs)){collector=collector||true;}else {if(isFunction(collector))collector();collector=null;}}return [collector,currentArgs]},type==1&&effect,type==2&&effect);};let useLayoutEffect=createEffect(1);let useEffect=createEffect(2);function useProp(name){let ref=useHost();if(name in ref.current){if(!ref[name]){ref[name]=[null,nextValue=>ref.current[name]=nextValue];}ref[name][0]=ref.current[name];return ref[name]}}function useEvent(type,eventInit={}){let ref=useHost();if(!ref[type]){ref[type]=(detail=eventInit.detail)=>dispatchEvent(ref.current,{type:type,...eventInit,detail:detail});}return ref[type]}function useState(initialState){let render=useRender();return useHook((state=[])=>{if(!state[1]){state[0]=isFunction(initialState)?initialState():initialState;state[1]=nextState=>{nextState=isFunction(nextState)?nextState(state[0]):nextState;if(nextState!=state[0]){state[0]=nextState;render();}};}return state})}function useRef(current){return useHook((state={current:current})=>state)}function useMemo(currentMemo,currentArgs){let[state]=useHook(([state,args,cycle=0]=[])=>{if(!args||args&&!isEqualArray(args,currentArgs)){state=currentMemo(currentArgs);}return [state,currentArgs,cycle]});return state}function useReducer(reducer,initialState){let render=useRender();return useHook((state=[])=>{if(!state[1]){state[0]=initialState;state[1]=action=>{let nextState=reducer(state[0],action);if(nextState!=state[0]){state[0]=nextState;render();}};}return state})}function useCallback(callback,args){return useMemo(()=>callback,args)}var core=Object.freeze({__proto__:null,useHost:useHost,render:render,h:h,Any:Any,c:c,useLayoutEffect:useLayoutEffect,useEffect:useEffect,useProp:useProp,useEvent:useEvent,useState:useState,useRef:useRef,useMemo:useMemo,useReducer:useReducer,useCallback:useCallback});const getValueIndentation=str=>str.split("").reduce((total,str)=>total+=str.charCodeAt(),0);function indentation(lines){const deep=[];return lines.split(/\n/).map(line=>{const test=line.match(/^(\s+)(.+)/);if(test){const[,space,line]=test;const indentation=getValueIndentation(space);if(!deep.includes(indentation)){deep.push(indentation);}return [indentation,line]}return [0,line]}).map(([indentation,line])=>[deep.indexOf(indentation),line])}let TAG;let ARGS;let ELEMENTS;const generic=[[/!\[([^\]]+)\]\(([^)]+)\)/g,(title,src)=>TAG(ELEMENTS.image,{src:src,title:title})],[/\[([^\]]+)\]\(([^)]+)\)/g,(title,href)=>TAG("a",{href:href},syntax(title))],[/\*\*([^*]+)\*\*/g,content=>TAG(ELEMENTS.bold,null,syntax(content))],[/_([^_]+)_/g,content=>TAG(ELEMENTS.italic,null,syntax(content))],[/~([^~]+)~/g,content=>TAG(ELEMENTS.inlineCode,null,syntax(content))]];const createArg=index=>`<${index}>`;function syntax(line){return generic.reduce((value,[search,create])=>value.replace(search,(ignore,...args)=>createArg(ARGS.push(create(...args))-1)),line).split(/(<\d+>)/).map(part=>{const test=part.match(/^<(\d+)>/);if(test){const[,index]=test;return ARGS[index]}return part}).filter(value=>value)}function parse(content,tag,args,elements){TAG=tag;ARGS=args;ELEMENTS=elements;const lines=indentation(content);const{length:length}=lines;const children=[];let currentList;let currentTable;for(let i=0;i<length;i++){const[deep,line]=lines[i];const testList=line.match(/^(\d+\.|-|\+)\s*(.+)/);if(testList){const[,type,content]=testList;if(!currentList){currentList=[ELEMENTS.list[/\d+\./.test(type)?0:1],[]];}currentList[1].push(TAG(ELEMENTS.listItem,null,syntax(content)));continue}const testTable=line.match(/^\|(.+)/);if(testTable){const[,content]=testTable;if(!currentTable){currentTable=[];}const td=content.split(/\|/);if(!/^-+$/.test(td[0].trim())){currentTable.push(TAG(ELEMENTS.tableRow,null,td.slice(0,td.length-1).map(content=>TAG(ELEMENTS.tableCol,null,syntax(content.trim())))));}continue}if(currentList){children.push(TAG(currentList[0],null,currentList[1]));currentList=null;}if(currentTable){children.push(TAG(ELEMENTS.table,null,currentTable));currentTable=null;}const testTitle=line.match(/^([\#]+)\s*(.+)/);if(testTitle){const[,lvl,content]=testTitle;children.push(tag(ELEMENTS.title.replace("*",lvl.length+""),null,syntax(content)));continue}const testQuote=line.match(/^>\s*(.+)/);if(testQuote){const[,content]=testQuote;children.push(TAG(ELEMENTS.quote,null,syntax(content)));continue}const testCode=line.match(/^~~~(.*)/);if(testCode){const[,type]=testCode;let content=[];while(i++){if(lines[i]&&lines[i][1]!=="~~~"){content.push(lines[i][1]);}else break}children.push(TAG(ELEMENTS.code,{type:type,"data-type":type},TAG(ELEMENTS.nestedCode,null,content.join("\n"))));continue}if(!line)continue;children.push(TAG(ELEMENTS.text,null,syntax(line)));}return children}const DEFAULT_ELEMENTS={link:"a",title:"h*",text:"p",inlineCode:"code",code:"pre",nestedCode:"code",quote:"blockquote",table:"table",tableRow:"tr",tableCol:"td",bold:"strong",italic:"i",image:"img",list:["ol","ul"],listItem:"li"};const setup$1=(tag,elements)=>(parts,...args)=>parse(parts.reduce((value,part,index)=>value+(part+(args[index]?createArg(index):"")),""),tag,args,{...DEFAULT_ELEMENTS,...elements});const md=setup$1(h);var markdown=Object.freeze({__proto__:null,md:md,default:md});var jsxRuntime=Object.freeze({__proto__:null,jsx:h,jsxs:h,jsxDEV:h});

const { c: c$1,useProp: useProp$1 } = core;function unwrapExports(x){return x&&x.__esModule&&Object.prototype.hasOwnProperty.call(x,"default")?x["default"]:x}const md$1 = unwrapExports(markdown.default);const { jsx: _jsx } = jsxRuntime;const { jsxs: _jsxs } = jsxRuntime;const style =
/*css*/
`
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

function markdown$1() {
  let [count, setCount] = useProp$1("count");
  return _jsxs("host", {
    shadowDom: true,
    children: [_jsx("style", {
      children: style
    }), _jsx("div", {
      class: "markdown",
      children: md$1`
        # Markdown ❤️ Js

        The parser transforms the code into virtualDOM.

        You can insert JS code easily ${_jsxs("button", {
        onclick: () => setCount(count + 1),
        children: ["Example this button with an ", _jsx("strong", {
          children: count
        }), " state"]
      })}

        Please help me to support: 

        - [ ] Better code compression.
        - [ ] Associate template arguments to code blocks.
        - [ ] Nested lists.
        - [ ] Task lists.

        - [👉 Github](https://github.com/uppercod/markdown-inline)
        - [👉 Author UpperCod](https://twitter.com/uppercod)
      `
    })]
  });
}

markdown$1.props = {
  count: {
    type: Number,
    reflect: true,
    value: 0
  }
};
customElements.define("markdown-inline", c$1(markdown$1));
