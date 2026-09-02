/**
 * Insight —— 每篇文章标题右侧的 Word 文档上传/下载按钮
 * 上传的 Word 文档（base64）保存在浏览器本地；点击「上传 Word」选择文件，上传后按钮变为「下载 Word」。
 */
var Insight = (function(){
  'use strict';
  var docs = {};
  function load(){ try{ docs = JSON.parse(localStorage.getItem('youcy_cn_insight_docs'))||{}; }catch(e){} }
  function save(){ try{ localStorage.setItem('youcy_cn_insight_docs', JSON.stringify(docs)); }catch(e){} }

  function upload(id){
    if(docs[id]){ download(id); return; }
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx';
    input.onchange = function(){
      var f = input.files[0]; if(!f) return;
      var reader = new FileReader();
      reader.onload = function(ev){
        docs[id] = { name:f.name, data:ev.target.result };
        try{ save(); }catch(e){ alert('文档太大，浏览器本地存不下（约 5MB 以内）。'); }
        render();
      };
      reader.readAsDataURL(f);
    };
    input.click();
  }

  function download(id){
    var d = docs[id];
    if(!d) return;
    var a = document.createElement('a');
    a.href = d.data;
    a.download = d.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function render(){
    document.querySelectorAll('[data-upload]').forEach(function(btn){
      var id = btn.getAttribute('data-upload');
      if(docs[id]){
        btn.textContent = '下载 Word';
        btn.classList.add('has-doc');
      } else {
        btn.textContent = '上传 Word';
        btn.classList.remove('has-doc');
      }
    });
  }

  load();
  render();

  return { upload:upload };
})();
