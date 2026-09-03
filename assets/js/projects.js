/**
 * 项目页 —— 每个项目右侧的图片上传（拖拽或点击），缩略图存储在浏览器本地
 */
var Projects = (function(){
  'use strict';
  var imgs = {};
  function load(){ try{ imgs = JSON.parse(localStorage.getItem('youcy_cn_projects'))||{}; }catch(e){} }
  function save(){ try{ localStorage.setItem('youcy_cn_projects', JSON.stringify(imgs)); }catch(e){} }

  function renderAll(){
    document.querySelectorAll('.project-images').forEach(function(box){
      render(box.getAttribute('data-project'));
    });
  }

  function render(pid){
    var box=document.querySelector('.project-images[data-project="'+pid+'"]');
    if(!box) return;
    var list=(imgs[pid]||[]).map(function(src,i){
      return '<div class="proj-thumb"><img src="'+src+'" alt=""><button class="proj-del" onclick="Projects.remove(\''+pid+'\','+i+')">×</button></div>';
    }).join('');
    box.innerHTML=list+'<button class="add-img-btn" onclick="Projects.addImage(\''+pid+'\')">＋ 上传图片</button>';
  }

  function addImage(pid){
    var input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.multiple=true;
    input.onchange=function(){
      Array.prototype.forEach.call(input.files, function(f){
        var r=new FileReader();
        r.onload=function(ev){
          if(!imgs[pid]) imgs[pid]=[];
          imgs[pid].push(ev.target.result);
          save(); render(pid);
        };
        r.readAsDataURL(f);
      });
    };
    input.click();
  }

  function remove(pid,i){ if(imgs[pid]){ imgs[pid].splice(i,1); save(); render(pid); } }

  function bindDrop(){
    document.querySelectorAll('.project-images').forEach(function(box){
      box.addEventListener('dragover',function(e){ e.preventDefault(); });
      box.addEventListener('drop',function(e){
        e.preventDefault();
        var files=e.dataTransfer && e.dataTransfer.files;
        if(!files || !files.length) return;
        var pid=box.getAttribute('data-project');
        Array.prototype.forEach.call(files, function(f){
          if(!f.type.match(/^image\//)) return;
          var r=new FileReader();
          r.onload=function(ev){
            if(!imgs[pid]) imgs[pid]=[];
            imgs[pid].push(ev.target.result);
            save(); render(pid);
          };
          r.readAsDataURL(f);
        });
      });
    });
  }

  load(); renderAll(); bindDrop();
  return { addImage:addImage, remove:remove };
})();
