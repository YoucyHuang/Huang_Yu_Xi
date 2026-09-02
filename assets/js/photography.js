/**
 * 摄影 —— 自由画布：拖拽上传照片，图片可拖动、缩放、删除
 * 依赖 interact.js（CDN）。照片与位置保存在浏览器本地。
 */
var Photo = (function(){
  'use strict';
  var boxes = [];
  function load(){ try{ var s=localStorage.getItem('youcy_cn_photos'); if(s) boxes=JSON.parse(s)||[]; }catch(e){} }
  function save(){ try{ localStorage.setItem('youcy_cn_photos',JSON.stringify(boxes)); }catch(e){} }

  function render(){
    var root=document.getElementById('vs-content');
    if(!root) return;
    var h='';
    if(!boxes.length){
      h='<span class="vs-drop-hint">拖入照片到画布任意位置，或点击上方「＋ 添加照片」</span>';
    }
    boxes.forEach(function(b){
      h+='<div class="vs-img" data-box="'+b.id+'" style="left:'+(b.x||80)+'px;top:'+(b.y||80)+'px;width:'+(b.w||260)+'px;height:'+(b.h||200)+'px">'
        +'<img src="'+b.img+'" alt="" draggable="false">'
        +'<div class="rs-handle"></div>'
        +'<button class="vs-del" data-del="'+b.id+'" title="删除">×</button>'
        +'</div>';
    });
    root.innerHTML=h;
    sizeCanvas();
    bindInteract();
    bindDelete();
  }

  function fitHeight(){
    var c=document.getElementById('vs-content');
    var maxB=0;
    if(c){
      c.querySelectorAll('.vs-img').forEach(function(el){
        var b=(parseFloat(el.style.top)||0)+el.offsetHeight;
        if(b>maxB) maxB=b;
      });
    }
    return Math.max(maxB+80, 600);
  }
  function sizeCanvas(){
    var c=document.getElementById('vs-content'); if(!c) return;
    c.style.height=fitHeight()+'px';
  }

  function select(el){ deselectAll(); if(el) el.classList.add('active'); }
  function deselectAll(){ document.querySelectorAll('.vs-img.active').forEach(function(el){ el.classList.remove('active'); }); }

  function persist(el){
    var id=el.getAttribute('data-box');
    if(!id) return;
    for(var i=0;i<boxes.length;i++){
      if(boxes[i].id===id){
        boxes[i].x=Math.round(parseFloat(el.style.left)||0);
        boxes[i].y=Math.round(parseFloat(el.style.top)||0);
        boxes[i].w=Math.round(parseFloat(el.style.width)||200);
        boxes[i].h=Math.round(parseFloat(el.style.height)||160);
        save(); break;
      }
    }
  }

  function bindInteract(){
    if(typeof interact==='undefined') return;
    interact('.vs-img').draggable({
      listeners: {
        start: function(e){ select(e.target); },
        move: function(e){
          var el=e.target;
          var x=(parseFloat(el.getAttribute('data-x'))||parseFloat(el.style.left)||0)+e.dx;
          var y=(parseFloat(el.getAttribute('data-y'))||parseFloat(el.style.top)||0)+e.dy;
          el.style.left=x+'px'; el.style.top=y+'px';
          el.setAttribute('data-x',x); el.setAttribute('data-y',y);
        },
        end: function(e){
          var el=e.target;
          el.classList.remove('active');
          persist(el);
          el.removeAttribute('data-x'); el.removeAttribute('data-y');
        }
      }
    }).resizable({
      edges:{bottom:true,right:true},
      listeners:{
        move:function(e){ var el=e.target; el.style.width=e.rect.width+'px'; el.style.height=e.rect.height+'px'; },
        end:function(e){ persist(e.target); }
      }
    }).on('tap',function(e){ select(e.target); });

    document.querySelectorAll('.vs-img').forEach(function(el){
      el.addEventListener('dblclick',function(e){
        e.preventDefault();
        var img=el.querySelector('img');
        if(img) lightbox(img.src);
      });
    });

    var canvas=document.getElementById('vs-content');
    if(canvas) canvas.addEventListener('mousedown',function(e){ if(e.target===canvas) deselectAll(); });
  }

  function bindDelete(){
    document.querySelectorAll('.vs-del').forEach(function(btn){
      btn.addEventListener('click',function(e){
        e.stopPropagation(); e.preventDefault();
        var id=btn.getAttribute('data-del');
        boxes=boxes.filter(function(b){ return b.id!==id; });
        save(); render();
      });
    });
  }

  function addImage(dataUrl, x, y){
    var id='p_'+Date.now()+'_'+Math.floor(Math.random()*100000);
    boxes.push({ id:id, x:x, y:y, w:260, h:200, img:dataUrl });
    save(); render();
  }

  function bindDrop(){
    var c=document.getElementById('vs-content');
    if(!c) return;
    c.addEventListener('dragover',function(e){ e.preventDefault(); });
    c.addEventListener('drop',function(e){
      e.preventDefault();
      var f=e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if(!f || !f.type.match(/^image\//)) return;
      var r=c.getBoundingClientRect();
      var x=Math.round(e.clientX-r.left-130);
      var y=Math.round(e.clientY-r.top-100);
      var reader=new FileReader();
      reader.onload=function(ev){ addImage(ev.target.result, Math.max(20,x), Math.max(20,y)); };
      reader.readAsDataURL(f);
    });
  }

  function addPhoto(){
    var input=document.createElement('input');
    input.type='file'; input.accept='image/*';
    input.onchange=function(){
      var f=input.files[0]; if(!f) return;
      var reader=new FileReader();
      reader.onload=function(ev){ addImage(ev.target.result, 80+boxes.length*30, 80+boxes.length*30); };
      reader.readAsDataURL(f);
    };
    input.click();
  }

  function lightbox(src){
    var lb=document.getElementById('lightbox');
    if(!lb) return;
    lb.querySelector('img').src=src;
    lb.classList.add('on');
  }

  document.addEventListener('DOMContentLoaded',function(){
    var lb=document.getElementById('lightbox');
    if(!lb) return;
    lb.addEventListener('click',function(e){ if(e.target===lb||e.target.classList.contains('lb-close')) lb.classList.remove('on'); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ lb.classList.remove('on'); deselectAll(); } });
  });

  load();
  render();
  bindDrop();

  return { addPhoto:addPhoto, lightbox:lightbox };
})();
