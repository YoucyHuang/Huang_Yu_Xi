/**
 * 导出改动 —— 左下角悬浮按钮，把所有浏览器本地改动（文字+图片）打包成 JSON 下载
 * 临时工具：导出后发给对方保存，之后可删除本文件与各页面的 <script> 引用。
 */
(function(){
  'use strict';
  function init(){
    var btn = document.createElement('button');
    btn.textContent = '导出改动';
    btn.title = '导出浏览器里所有的改动（文字+图片），下载成文件发给对方保存';
    btn.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:99999;font-family:system-ui,sans-serif;font-size:12px;background:#1d1d1f;color:#fff;border:none;border-radius:999px;padding:8px 16px;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,.25);opacity:.72';
    btn.onmouseenter = function(){ btn.style.opacity = '1'; };
    btn.onmouseleave = function(){ btn.style.opacity = '.72'; };
    btn.onclick = function(){
      var data = {};
      var n = 0;
      for(var i=0;i<localStorage.length;i++){
        var k = localStorage.key(i);
        if(k && k.indexOf('youcy_cn')===0){ data[k] = localStorage.getItem(k); n++; }
      }
      if(!n){ alert('没有检测到浏览器里的改动（localStorage 为空）。'); return; }
      var blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'youcy-changes.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    document.body.appendChild(btn);
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else init();
})();
