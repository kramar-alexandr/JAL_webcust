 
function FileUpload(wrap,filesinp,tag,id,callback,ow_list)
{
  this.started = false;
  this.totfiles = 0;
  this.donefiles = 0;
   
  this.DouploadChunk = function(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,blob,callback){
     var self = this;
     var xhr = new XMLHttpRequest();
     xhr.open('POST', "/WebFileUpload_Cust.hal?action=doupload&sess=" + sess + "&part=" + start +"&nocache="+new Date().getTime(), true);
     xhr.upload.onprogress = function (e) {

     };
     xhr.onloadend = function (e) {
     };
    var blob = file.slice(start,end);

    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if ($(xhr.responseText).attr("res")=="1"){
            start = end;
            end = start + BYTES_PER_CHUNK;
            $(progress).val((start/filesize) * 100);          
          } else if ($(xhr.responseText).attr("res")=="0"){
            switch ($(xhr.responseText).attr("err")){
              case "2":
              case "3":
                //try again for both cases
                break;
              case "4":
                alert("Upload failed - please refresh the page");
                callback("","");
                return;
              case "5":
                alert("Upload failed - failed uploading a package");
                callback("","");
                return;
              default:
                alert("Upload failed - unknown error");
                callback("","");
                return;
            }
          } else {
            alert("Upload failed - no response text");
            return;
          }
          self.UploadOnePart(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,callback);
          //failed
          
        } else {
          self.UploadOnePart(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,callback);
        }
      }
    };
    xhr.onerror = function (e){
      callback("","");
      alert("Upload failed - no connection to server. Try refreshing the page");
    }
    xhr.send(blob)
  }


  this.UploadOnePart = function(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,callback){
    var self = this;
    if (start<filesize){
      self.DouploadChunk(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,file.slice(start, end),callback);
    } else {
      $.get("/WebFileUpload_Cust.hal?action=finishupload&sess=" + sess,function(data){
        self.donefiles++;
        if (self.totfiles==self.donefiles){
          callback(data,file.filename);
        }
      });
    }
  }
  
  this.UploadSingleFile = function(num,wrap,file,tag,id,callback){
    var start = 0;
    var end = 0;
    var filesize = 0;
    var self = this;
    if ($(wrap).find(".file_list").length>0){
      $(wrap).find(".file_list .file.filenum" + num).append('<progress class="progress_bar' + num + '" value="0" max="100"></progress>');
    } else {
      $(wrap).append('<progress class="progress_bar' + num + '" value="0" max="100"></progress>');
    }
    var progress =  $(wrap).find(".progress_bar" + num).get(0);
    filesize = file.size;
    BYTES_PER_CHUNK =  1024*100
    $.get("/WebFileUpload_Cust.hal?action=startupload&tag=" + tag + "&id=" + id + "&filename=" + file.name,function(data){
      if ($(data).attr("stat")=="0"){
        alert("Failed to start upload");
        $(progress).remove();
      } else {
       var sess = $(data).attr("sessionid");
       start = 0;
       end = BYTES_PER_CHUNK;
       setTimeout(function(){
          self.UploadOnePart(file,start,end,filesize, BYTES_PER_CHUNK,progress,sess,callback);
       },1);
      }
    });
  }
  
  this.FileInList = function(file,ow_list){
    var res = false;
    for (var i=0;i<ow_list.length;i++){
      if (ow_list[i].name==file.name){
        res = true;
      }
    }
    
    return res;
  }

  this.DoUploadFile = function(wrap,filesinp,tag,id,callback,ow_list){//overwrite list
    this.started = true;
    this.totfiles = filesinp.files.length;
    if (ow_list){
      this.totfiles = ow_list.length;
    }
    var self = this;
    for (var i = 0; i < filesinp.files.length;i++){
      if (!ow_list || this.FileInList(filesinp.files[i],ow_list)){
        var file = filesinp.files[i];
        this.UploadSingleFile(i,wrap,file,tag,id,callback);
      }
    }
  }
  this.DoUploadFile(wrap,filesinp,tag,id,callback,ow_list);//put the arguments in the object...
}