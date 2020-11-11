function SetPagination(){

  if ($('#pagenave').length>0) {
    $('#pagenave').pagination({
      dataSource: function(done){
          var result = [];
          for (let li of $('.smu_shoplist_hidden .smu_shoplist_smu')) {
              if ($(li).css("display")!="none"){
                result.push($(li).clone());
              }
          }
          done(result);
      },
      prevText: 'IEPRIEKŠĒJĀ',
      nextText: 'NĀKAMĀ',
      showPageNumbers: true,
      pageSize: 4,
      callback: function (data, pagination) {
          $('.smu_shoplist').html(data);
      }
    });
  }
}

$(document).ready(function(){

  listFilter($(".smu_shop_searchbox input"));
  SetPagination();
  InitShopEdit();

});

function listFilter(input) {
 
  $(input)
    .change( function () {
      var filter = $(this).val();
      if(filter) {
        $(".smu_shoplist_hidden .smu_shoplist_smu:not(:Contains(" + filter + "))").slideUp();
        $(".smu_shoplist_hidden .smu_shoplist_smu:Contains(" + filter + ")").slideDown();
      } else {
        $(".smu_shoplist_hidden .smu_shoplist_smu").each(function(){
          $(this).slideDown();
        
         });
      }
      SetPagination();
      return false;
    })
  .on('keypress', function () {
      $(this).change();
  }).on('keyup', function() {
    $(this).change();
  })

}

function InitShopEdit(){
  if ($(".smu_basic_info").length>0){
    var app = new ShopEditPage();
  }
}


function ShopEditPage(){
  this.name = $(".smu_name");
  this.code = "";
  this.school = $(".smu_school");
  this.spec = $(".smu_spec");
  this.descr = $(".smu_descr");
  this.insubmit = false;
  this.extpage = $(".externalpage input");
  this.twitter = $(".twitterpage input");
  this.instagram = $(".instagrampage input");
  this.fb = $(".fbpage input");
  this.contactemail = $(".contactemail input");
  this.logo = $(".shop_logo");
  this.background = $(".shop_background");
  this.items = [];
  this.errorf = false;
  this.RemoveItems = [];

  this.Init = function(){
    var self = this;
    $.get("/WebGetSMUDataForShopEditing.hal",function(data){
      var js = JSON.parse(data);
      self.name.val(js.SMFName);
      self.school.val(js.School);
      self.spec.val(js.ProdSpec);
      self.descr.text(js.Text);
      self.code = js.SMFCode;

      self.extpage.val(js.ExtWebPage);
      self.twitter.val(js.TwitterPage);
      self.instagram.val(js.InstagramPage);
      self.fb.val(js.FacebookPage);
      self.contactemail.val(js.ContactEmail);

      self.origLogo = js.Logo;
      self.origBackground = js.Background;
      self.InitCompanyImage(self.origBackground,self.background,"newBackground",jal_str['Fons']);
      self.InitCompanyImage(self.origLogo,self.logo,"newLogo",jal_str['Logo']);
      self.InitItems(js.items);

    })
    $(".smu_submit .save_only").click(function(){
      self.SubmitForm(false);
    })
    $(".smu_submit .save_submit").click(function(){
      self.SubmitForm(true);
    })
  }

  this.AddItemData = function(val,n,cls,label){
    if (val==""){
      val = label;
    }
    $(n).find(cls).html(val).click(function(){
      var el = this;
      var tval = $(this).html();
      if (tval==label){
        tval = "";
      }
      $(this).html("<input type='text' value='" + tval + "'>");
      $(this).find("input").focus().bind("change blur",function(e){
        if ($(this).val()!=""){
          $(el).html($(this).val());
        } else {
          $(el).html(label);
        }
      });
      $(this).find("input").bind("click",function(e){
        e.stopPropagation();
      });
    })
  }

  this.AddSingleItem = function(item){
    var n = $($(".item_template").html());
    if (item.hasOwnProperty("Logo") && item.Logo!=""){
      $(n).find(".logo_frame").html("<img src='" + item.Logo + "'><div class='edit_image'>" + jal_str['Labot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    } else {
      $(n).find(".logo_frame").html("<div class='empty_img'><div class='text'>" + jal_str["PievienotFoto"] + "</div></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    }
    $(n).data("uuid",item.UUID);
    this.AddItemData(item.Name,n,".name_frame",jal_str["PievienotAprakstu"]);
    this.AddItemData(item.Price,n,".price_frame",jal_str["PievienotCenu"]);

    $(".item_list").append(n);
    this.InitFileUpload($(n).find(".logo_frame"));
}

  this.InitItems = function(items){
    for (item of items) {
      this.AddSingleItem(item);
    }
    this.AddSingleItem({Name:"",Price:""});
  }

  this.InitCompanyImage = function(link,el,newvalid,label){
    if (link!=""){
      el.html("<img src='" + link + "'><div class='edit_image'>" + jal_str['Labot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    } else {
      el.html("<div class='empty_img'><div class='text'>" + label + "</div></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    }
    this.InitFileUpload(el);

  }

  this.InitFileUpload = function(el){
    el.find(".edit_image").click(function(){
      el.find(".fileupload").click();
    })
    el.find(".fileupload").change(function(){
      if (this.files.length>0) {
        let file = this.files[0];
        let newf = false;
        let img = el.find("img").get(0);
        if (!img){
          img = document.createElement("img");
          newf = true;
        }
        let reader = new FileReader();
        reader.onloadend = function() {
          img.src = reader.result;
        }
        reader.readAsDataURL(file);   
        if (newf) {
          el.find(".empty_img").remove();
          el.prepend(img);
        }  
      }
    });
  }

  this.SetErrorField = function(field){

  }

  this.ValidateForm = function(){
    this.errorf = false;
    var res = true;
    if ($(this.descr).text()==""){
      this.SetErrorField(this.descr);
    }

    return res;
  }

  this.GetItemData = function(){
    let items = [];
    $(".item_list .shop_item").each(function(){
      let item = {};
      item.uuid = $(this).data("uuid");
      item.Name = $(this).find(".name_frame").html();
      item.Price = $(this).find(".price_frame").html();
      if (item.Name!="" && item.Name!=jal_str["PievienotAprakstu"]){
        items.push(item);
      }
    })

    return items;
  }

  this.LoadData = function(){
    let data = {};
    data.Text = this.descr.val();
    data.Twitter = this.twitter.val();
    data.Facebook = this.fb.val();
    data.Instagram = this.instagram.val();
    data.ExtWebPage = this.extpage.val();
    data.ContactEmail = this.contactemail.val();
    if ($(".shop_background").find(".fileupload").get(0).files.length>0) {
      data.RemoveBackground = 1;
    } else {
      data.RemoveBackground = 0;
    }
    if ($(".shop_logo").find(".fileupload").get(0).files.length>0) {
      data.RemoveLogo = 1;
    } else {
      data.RemoveLogo = 0;
    }
    data.RemoveItems = this.RemoveItems.join(",");
    data.items = this.GetItemData();
    return data;
  }

  this.UploadAllFiles = function(fdata,data){
    var js = JSON.parse(data);
    var totfiles = 0;
    var uploadedfiles = 0;
    var func = function(){
      uploadedfiles++;
      if (totfiles==uploadedfiles) {
        alert("Informācija atjaunota");
        window.location.reload();
      }
    };
    if ($(".shop_background").find(".fileupload").get(0).files.length>0) {
      totfiles++;
      var inp = $(".shop_background").find(".fileupload").get(0);
      var upl = new FileUpload($(".shop_background"),inp,"background",this.code,func,null);
    }
    if ($(".shop_logo").find(".fileupload").get(0).files.length>0) {
      totfiles++;
      var inp = $(".shop_logo").find(".fileupload").get(0);
      var upl = new FileUpload($(".shop_logo"),inp,"logo",this.code,func,null);      
    }
    var i = 0;
    var list = js.imglist.split(",");
    $(".item_list .shop_item").each(function(){
      if ($(this).find(".fileupload").get(0).files.length>0) {
        let uuid = $(this).data("uuid");
        if (uuid!==undefined && uuid!=""){
          nuuid = uuid;
        } else {
          nuuid = list[i];
        }
        var inp = $(this).find(".fileupload").get(0);
        totfiles++;
        var upl = new FileUpload($(this),inp,"smuitem",nuuid,func,null);      
      }
      i++;
    });
    if (totfiles==0) {
      alert("Informācija atjaunota");
      window.location.reload();
    }
  }

  this.SubmitForm = function(submitf){
    var self = this;
    if (this.insubmit==false && this.ValidateForm()) {
      this.insubmit = true;
      fdata = this.LoadData();
      url = "/WebStoreSMUDataForShop.hal";
      //submit form
      $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(fdata),
        success: function(data){
          self.UploadAllFiles(fdata,data);
          self.insubmit = false;
        }
      })
    }
  }

  this.Init();

}