/**
 * 视觉研究 —— 自由画布：文字与图片可拖拽，图片可自由缩放
 * 依赖 interact.js（CDN）。内容与布局保存在浏览器本地。
 */
var VS = (function(){
  'use strict';

  var base = 'assets/images/artworks/';

  var ALL_SECTIONS = [
    { id:'early', title:'早期', years:'9–18 岁',
      text:'绘画与小说——这些艺术形式自幼便深深吸引着我，是艺术引领我走进了人文领域。在我早期的绘画中，我试图表明：我对人文的热情、对艺术的挚爱，深植于我的本能。我决定把自己的道路建立在这个领域上。这个决定并非一时兴起，而是源于对自身能力的认识、对艺术的持续研习、对人文的献身，以及一种探索新事物的使命感。',
      images:['01-9岁绘画.jpeg','01-14岁绘画.jpeg','01-17岁绘画.jpeg','01-18岁绘画.jpeg'] },
    { id:'mimic', title:'本硕阶段——摹写现实世界', years:'2021–2022',
      text:'学院训练的第一阶段。目标是把可见世界尽可能忠实地再现——在二维平面上构建三维空间，循着从希腊艺术到达·芬奇、米开朗基罗的谱系。然而，这种对艺术的认知并未持续太久。我开始研读笛卡尔、康德等思想家的理论。世界可以被镜像，但我们只能认识现象，永远无法触及物自体。那么，我想在绘画中揭示的「真实」究竟是什么？我陷入困惑，开始怀疑一切，也开始写诗。',
      images:['4 (1).jpeg','4 (2).jpeg','4 (3).jpeg','4 (4).jpeg','4 (5).jpeg','4（6）.jpeg'] },
    { id:'expression', title:'本硕阶段——转向表现', years:'2022–2023',
      text:'从客观再现转向主观表现。问题从「世界看起来如何」变为「世界感觉起来如何」——受现代艺术家与哲学家的影响。自那以后，塞尚开始在我的艺术学习中占据重要位置。海德格尔的理论对我而言难以理解，于是我开始上网课，正式学习哲学。',
      images:['5 (1).jpeg','5 (11).jpeg','5 (12).jpeg','5 (13).jpeg','5 (14).jpeg','5 (15).jpeg','5 (16).jpeg','5 (17).jpeg','5 (18).jpeg','5 (19).jpeg','5 (20).jpeg','5（21）.jpeg'] },
    { id:'aura', title:'本硕阶段——寻找灵晕，探索材料性', years:'2023',
      text:'对「灵晕」（aura）的追寻——本雅明所描述的、那种「无论多近都保留着距离」的独特现象。对材料性的实验：颜料如何在表面驻留，质感如何在被辨认之前便承载意义，作品的物质实体如何在图像成形之前就已开始言说。',
      images:['6 (1).jpeg','6 (2).jpeg','6 (3).jpeg','6 (4).jpeg','6 (5).jpeg','6 (6).jpeg'] },
    { id:'classical', title:'古典与新古典——学院体系训练', years:'2021–2024',
      text:'多年的系统性学院训练。我花了大量时间研习人体解剖、点线面的关系，以及这些元素如何与所绘对象相互作用，又如何影响形与灵晕——哪些被增添，哪些被舍弃。这是技法的根基，是其余一切赖以站立的地基。',
      images:['7 (1).jpeg','7 (2).jpeg','7 (3).jpeg','7 (4).jpeg','7 (5).jpeg','7 (6).jpeg'] },
    { id:'authentic', title:'本真系列', years:'2024',
      text:'海德格尔对「此在」与「常人」的区分——本真与非本真的存在——引出了一系列肖像。捕捉人们不再为他人表演的时刻——「常人」背后的本真部分，在表演卸下的瞬间。多多少少，它也投射出我对所绘对象的情绪。',
      images:['1 (3).jpeg','1 (4).jpeg','1 (5).jpeg','1 (6).jpeg','1 (7).jpeg','1 (8).jpeg','1 (9).jpeg','1 (10).jpeg','1 (11).jpeg','1 (12).jpeg','1 (13).jpeg','1 (14).jpeg','1 (15).jpeg','1 (16).jpeg','1 (17).jpeg'] },
    { id:'shanshui', title:'山水系列', years:'2024–2025',
      text:'研读后殖民理论之后，我意识到自己对自己生长的文化知之甚少——我一直在用西方的眼光看待自己的传统。于是这些作品试图在中国山水美学与西方形式之间架起桥梁。我向我热爱的画家学习绘画语言：托姆布雷、莱曼、塞尚，并把它们凝结在中国古典山水画的结构之中；尝试经由色彩，将中国艺术的逻辑与观念转译成一种跨越时间与大陆、可被理解的方式。半透明之山：可见背后的东西。',
      images:['3 (1.).jpeg','3 (2.).jpeg','3 (3.).jpeg','3 (4.).jpeg','3 (5.).jpeg','3 (5.1).jpeg','3 (5.2).jpeg','3 (6.).jpeg','3 (6.1).jpeg','3 (6.2).jpeg','3 (6.3).jpeg','3 (7.).jpeg','3 (7.1).jpeg','3 (7.2).jpeg','3 (7.3).jpeg'] }
  ];

  function pageKey(){
    var p=(location.pathname||'').split('/').pop()||'visual-studies.html';
    p=p.replace(/\.html?$/i,'');
    return p||'visual-studies';
  }
  var PK = pageKey();
  var MODULE = (window.VS_MODULE && window.VS_MODULE.length) ? window.VS_MODULE : null;
  var sections = MODULE ? ALL_SECTIONS.filter(function(s){ return MODULE.indexOf(s.id)!==-1; }) : ALL_SECTIONS;

  function esc(s){ var d=document.createElement('div');d.textContent=s;return d.innerHTML; }
  function sanitize(f){ return f.replace(/[^a-zA-Z0-9]/g,'_'); }
  function imgKey(secId, img){ return 'i-'+secId+'-'+sanitize(img); }

  // ── 布局持久化（位置 + 尺寸）──
  var layout = {};
  function loadLayout(){ try{ var s=localStorage.getItem('youcy_cn_vs_'+PK); if(s) layout=JSON.parse(s); }catch(e){} }
  function saveLayout(){ try{ localStorage.setItem('youcy_cn_vs_'+PK,JSON.stringify(layout)); }catch(e){} }

  // ── 文字持久化 ──
  function loadTexts(){ try{ var s=localStorage.getItem('youcy_cn_vs_texts_'+PK); if(s){ var d=JSON.parse(s); sections.forEach(function(sec){ var v=d[sec.id]; if(typeof v==='string'){ sec.text=v; } else if(v){ if(v.text) sec.text=v.text; if(v.title) sec.title=v.title; if(v.years) sec.years=v.years; } }); } }catch(e){} }
  function saveTexts(){ var d={}; sections.forEach(function(sec){ d[sec.id]={text:sec.text, title:sec.title, years:sec.years}; }); try{ localStorage.setItem('youcy_cn_vs_texts_'+PK,JSON.stringify(d)); }catch(e){} }

  function defaultLayout(){
    var L = {};
    var x0 = 90, y = 70;
    sections.forEach(function(sec){
      L['t-'+sec.id] = {x:x0, y:y, w:560};
      y += 100;
      var th = Math.max(120, Math.ceil(sec.text.length/78)*34 + 12);
      L['x-'+sec.id] = {x:x0, y:y, w:820};
      y += th + 60;
      var cols=5, imgW=210, imgH=165, gap=20;
      sec.images.forEach(function(img, idx){
        var r=Math.floor(idx/cols), c=idx%cols;
        L[imgKey(sec.id,img)] = {x:x0 + c*(imgW+gap), y:y + r*(imgH+15+gap), w:imgW, h:imgH};
      });
      var rows = Math.ceil(sec.images.length/cols);
      y += rows*(imgH+15+gap) + 110;
    });
    return L;
  }

  function ensureLayout(){
    var def = defaultLayout();
    Object.keys(def).forEach(function(k){ if(!layout[k]) layout[k]=def[k]; });
  }

  function pos(key, dfltW, dfltH){
    return layout[key] || {x:90, y:90, w:dfltW, h:dfltH};
  }

  function render(){
    var root = document.getElementById('vs-content');
    if(!root) return;
    ensureLayout();

    var h='';
    sections.forEach(function(sec){
      var tk='t-'+sec.id, tp=pos(tk,560,0);
      h+='<div class="vs-txt vs-title" data-el="'+tk+'" data-kind="title" style="left:'+tp.x+'px;top:'+tp.y+'px;width:'+tp.w+'px">'
        +'<h3 contenteditable="true" data-sec="'+sec.id+'" data-field="title">'+esc(sec.title)+'</h3>'
        +'<span class="vs-years" contenteditable="true" data-sec="'+sec.id+'" data-field="years">'+esc(sec.years)+'</span>'
        +'<div class="rs-handle-r"></div>'
        +'</div>';

      var xk='x-'+sec.id, xp=pos(xk,820,0);
      h+='<div class="vs-txt vs-body" data-el="'+xk+'" data-kind="body" style="left:'+xp.x+'px;top:'+xp.y+'px;width:'+xp.w+'px">'
        +'<p contenteditable="true" data-sec="'+sec.id+'" data-field="text">'+esc(sec.text)+'</p>'
        +'<div class="rs-handle-r"></div>'
        +'</div>';

      sec.images.forEach(function(img){
        var ik=imgKey(sec.id,img), ip=pos(ik,210,165);
        var src=base+encodeURI(img);
        var cap=img.replace(/\.(jpeg|jpg)$/i,'');
        h+='<div class="vs-img" data-el="'+ik+'" data-sec="'+sec.id+'" data-img="'+img+'" style="left:'+ip.x+'px;top:'+ip.y+'px;width:'+ip.w+'px;height:'+ip.h+'px">'
          +'<img src="'+src+'" alt="'+esc(cap)+'" draggable="false">'
          +'<span class="caption">'+esc(cap)+'</span>'
          +'<div class="rs-handle"></div>'
          +'</div>';
      });
    });

    root.innerHTML=h;
    sizeCanvas();
    bindInteract();
    bindTextEditing();
  }

  function fitHeight(){
    var c=document.getElementById('vs-content');
    var maxB=0;
    if(c){
      c.querySelectorAll('.vs-img,.vs-txt').forEach(function(el){
        var b=(parseFloat(el.style.top)||0)+el.offsetHeight;
        if(b>maxB) maxB=b;
      });
    }
    return Math.max(maxB+80,900);
  }

  function sizeCanvas(){
    var c=document.getElementById('vs-content'); if(!c) return;
    var fit=fitHeight();
    var saved=layout['__canvas_h']||0;
    c.style.height=Math.max(fit, saved)+'px';
  }

  function select(el){ deselectAll(); if(el) el.classList.add('active'); }
  function deselectAll(){
    document.querySelectorAll('.vs-img.active,.vs-txt.active').forEach(function(el){ el.classList.remove('active'); });
  }

  function bindInteract(){
    if(typeof interact==='undefined') return;

    // 图片：拖拽 + 缩放（宽高）
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
          sizeCanvas();
        }
      }
    }).resizable({
      edges:{bottom:true,right:true},
      listeners:{
        move:function(e){ var el=e.target; el.style.width=e.rect.width+'px'; el.style.height=e.rect.height+'px'; },
        end:function(e){ persist(e.target); }
      }
    }).on('tap',function(e){ select(e.target); });

    // 文字块：拖拽 + 宽度缩放（点进文字不拖拽）
    interact('.vs-txt').draggable({
      ignoreFrom:'[contenteditable]',
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
          sizeCanvas();
        }
      }
    }).resizable({
      edges:{right:true},
      listeners:{
        move:function(e){ e.target.style.width=e.rect.width+'px'; },
        end:function(e){ persist(e.target); }
      }
    }).on('tap',function(e){ select(e.target); });

    // 双击图片 → 灯箱
    document.querySelectorAll('.vs-img').forEach(function(el){
      el.addEventListener('dblclick',function(e){
        e.preventDefault();
        var img=el.querySelector('img');
        if(img) lightbox(img.src);
      });
    });

    // 点空白处取消选中
    var canvas=document.getElementById('vs-content');
    if(canvas){
      canvas.addEventListener('mousedown',function(e){ if(e.target===canvas) deselectAll(); });
    }
  }

  function bindTextEditing(){
    document.querySelectorAll('.vs-txt [contenteditable][data-sec]').forEach(function(el){
      el.addEventListener('blur',function(){
        var sid=el.getAttribute('data-sec');
        var field=el.getAttribute('data-field')||'text';
        for(var i=0;i<sections.length;i++){
          if(sections[i].id===sid){ sections[i][field]=el.textContent.trim(); saveTexts(); break; }
        }
        sizeCanvas();
      });
    });
  }

  function persist(el){
    var key=el.getAttribute('data-el');
    if(!key) return;
    var obj={
      x: Math.round(parseFloat(el.style.left)||0),
      y: Math.round(parseFloat(el.style.top)||0),
      w: Math.round(parseFloat(el.style.width)||200)
    };
    if(el.classList.contains('vs-img')) obj.h=Math.round(parseFloat(el.style.height)||160);
    layout[key]=obj;
    saveLayout();
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
    lb.addEventListener('click',function(e){
      if(e.target===lb||e.target.classList.contains('lb-close')) lb.classList.remove('on');
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ lb.classList.remove('on'); deselectAll(); }
    });
  });

  function init(){
    loadLayout();
    loadTexts();
    render();
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); }
  else{ init(); }

  return { lightbox:lightbox };
})();
