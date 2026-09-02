/**
 * 全站文字可编辑：点击任意正文文字即可直接修改，失焦自动保存到浏览器本地。
 * 排除导航栏与页脚。
 */
(function(){
  'use strict';
  function pageKey(){
    var p=(location.pathname||'').split('/').pop()||'index.html';
    return p.replace(/\.html?$/i,'')||'index';
  }
  var LS='youcy_cn_texts_'+pageKey();
  var state={};
  try{ var raw=localStorage.getItem(LS); if(raw) state=JSON.parse(raw)||{}; }catch(e){}

  function save(){ try{ localStorage.setItem(LS,JSON.stringify(state)); }catch(e){} }

  function editableEls(){
    var out=[];
    document.querySelectorAll('h1,h2,h3,h4,p,li,blockquote,.doc-title,.doc-desc').forEach(function(el){
      if(el.closest('.nav,.footer,#vs-content')) return;
      out.push(el);
    });
    return out;
  }

  function init(){
    editableEls().forEach(function(el,i){
      el.setAttribute('contenteditable','true');
      if(state[i]!==undefined && state[i]!==null) el.textContent=state[i];
    });
    document.addEventListener('blur',function(e){
      var t=e.target;
      if(!t || !t.getAttribute || t.getAttribute('contenteditable')!=='true') return;
      if(t.closest('.nav,.footer,#vs-content')) return;
      var i=editableEls().indexOf(t);
      if(i>=0){ state[i]=t.textContent.trim(); save(); }
    }, true);
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }
})();
