import f3 from '../src/index.js'
import Edit from './elements/Edit.js'
import ReactiveTextarea from "./elements/ReactiveTextarea.js"
import ReactiveVanila from "./elements/ReactiveVanila.js"
import Display from "./elements/Display.js"
import {Form} from "../src/view/elements/Form.js"


(async () => {
  const cont = document.querySelector("#FamilyChart"),
    card_dim = {w:220,h:70,text_x:75,text_y:15,img_w:60,img_h:60,img_x:5,img_y:5},
    card_display = cardDisplay(),
    card_edit = cardEditParams(),
    store = f3.createStore({
      data: firstNode(),
      node_separation: 250,
      level_separation: 150
    }),
    view = f3.d3AnimationView({
      store,
      cont: document.querySelector("#FamilyChart"),
      card_edit,
    }),
    Card = f3.elements.Card({
      store,
      svg: view.svg,
      card_dim,
      card_display,
      mini_tree: true,
      link_break: false,
      cardEditForm,
      addRelative: f3.handlers.AddRelative({store, cont, card_dim, cardEditForm, labels: {mother: 'Add mother'}}),
    }),
    edit = Edit('#edit_cont', card_edit),
    display = Display('#display_cont', store, card_display),
    reactiveTextArea = ReactiveTextarea(data => {store.update.data(data); store.update.tree()}, "#textarea", "#update_btn"),
    reactiveVanila = ReactiveVanila( "#ReactiveVanila"),
    onUpdate = (props) => {
      view.update(props || {});
      reactiveTextArea.update(store.getData());
      reactiveVanila.update(store, card_display);
    }

  view.setCard(Card)
  fetch('./elements/family-chart.css').then(r => r.text()).then(text => document.querySelector('#family-chart-css').innerText = text)
  store.setOnUpdate(onUpdate)
  store.update.tree({initial: true})

  function cardEditForm(props) {
    const postSubmit = props.postSubmit;
    props.postSubmit = (ps_props) => {postSubmit(ps_props)}
    const el = document.querySelector('#form_modal'),
      modal = M.Modal.getInstance(el),
      edit = {el, open:()=>modal.open(), close:()=>modal.close()}
    Form({...props, card_edit, card_display, edit})
  }
})();

function firstNode() {
  return [{id: '0', rels: {}, data: {'fn': 'Unknown', 'ln': 'Tan', 'birth': ?, 'death': ?, label: '譚', gender: 'M'
	  desc: '',
      image: 'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg'}},
	  {id: '1', rels: {}, data: {'fn': 'Hongzhi', 'ln': 'Tan', 'birth': 901, 'death': 974, label: '譚', gender: 'M'
	  desc: 'Lived in Xijun Village, Qianzhou, Jiangxi (now Ningdu, Jiangxi). In the first year of Jianlong of the Song Dynasty (960), due to local unrest, he moved to Shashui Village, Zhujili, Baochang County, Nanxiong to avoid chaos. In the third year of Jianlong of the Song Dynasty (962), he returned to Qianzhou after peace. Hong Gui gave birth to two sons, Tan Hong and Tan Han.',
      image: 'https://p3-sdbk2-media.byteimg.com/tos-cn-i-xv4ileqgde/2c9ac1a536c74c7fa588e5f99fca4b33~tplv-xv4ileqgde-resize-w:750.image'}},
	  {id: '2', rels: {}, data: {'fn': 'Hong', 'ln': 'Tan', 'birth': 930, 'death': 1000, label: '譚洪', gender: 'M'
	  desc: '',
      image: 'https://p3-sdbk2-media.byteimg.com/tos-cn-i-xv4ileqgde/2c9ac1a536c74c7fa588e5f99fca4b33~tplv-xv4ileqgde-resize-w:750.image'}},
	  ]
}

function cardEditParams() {
  return [
    {type: 'text', placeholder: 'first name', key: 'fn'},
    {type: 'text', placeholder: 'last name', key: 'ln'},
    {type: 'text', placeholder: 'birth', key: 'birth'},
    {type: 'text', placeholder: 'death', key: 'death'},
    {type: 'text', placeholder: 'chinese name', key: 'label'}
    {type: 'text', placeholder: 'gender', key: 'gender'}
    {type: 'text', placeholder: 'description', key: 'desc'}
    {type: 'text', placeholder: 'image url', key: 'image'}
  ]
}

function cardDisplay() {
  const d1 = d => `${d.data['label'] || ''}`,
	d2 = d => `${d.data['fn'] || ''} ${d.data['ln'] || ''}`,
    d3 = d => `(${d.data['birth'] || ''} - ${d.data['death'] || ''})`,
	d4 = d => `${d.data['desc'] || ''}`
  d1.create_form = "{label}"
  d2.create_form = "{fn} {ln}"
  d3.create_form = "{birth} - {death}"
  d4.create_form = "{desc}"

  return [d1, d2, d3, d4]
}
