var imgcnt = 0;

function UploadSingleThumb(el,link,smf,name,uuid){
  var thumb_image = new Image();
  thumb_image.onload = function (imageEvent) {

      // Resize the image
      var canvas = document.createElement('canvas'),
          max_size = 500,// TODO : pull max size from a site config
          width = thumb_image.width,
          height = thumb_image.height;
      if (width > height) {
          if (width > max_size) {
              height *= max_size / width;
              width = max_size;
          }
      } else {
          if (height > max_size) {
              width *= max_size / height;
              height = max_size;
          }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(thumb_image, 0, 0, width, height);
      if (name.substr(-3)=="png") {
        var dataUrl = canvas.toDataURL('image/png', 1);
      } else {
        var dataUrl = canvas.toDataURL('image/jpeg');
      }
      var resizedImage = dataURLToBlob(dataUrl);
      resizedImage.name = "thumb_" + name;
      var upl = new FileUpload(el,null,"smuitem",uuid,function(){imgcnt++;$(".test_data").html(imgcnt + "/" + $(".test_item_wrap").length)},null,resizedImage);      
  }
  thumb_image.src = link;
}

function InitImageFix(){
  $(".test_item_wrap").each(function(){
    let l = $(this).attr("link");
    if (l!=""){
      UploadSingleThumb($(this),l,$(this).attr("smf"),$(this).attr("name"),$(this).attr("uuid"));
    }
  });

}

function dataURLToBlob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = parts[1];

      return new Blob([raw], {type: contentType});
  }

  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(':')[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: contentType});
}

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
      pageSize: 28,
      callback: function (data, pagination) {
          $('.smu_shoplist').html(data);
      }
    });
  }
}
function matchall(str,search){
  var regEx = new RegExp(search, "ig");
  return str.match(regEx);
}

function UpdateBasket(){
  $.get("/WebGetBasketQty.hal",function(data){
    let js = JSON.parse(data);
    $(".catalog_basket").html("<div class='basket_cnt'>" + js.basket + "</div>").click(function(){
      location.href = "/katalogs/grozs";
    });
    $(".catalog_fav").html("<div class='basket_cnt'>" + js.fav + "</div>").click(function(){
      location.href = "/katalogs/favoriti";
    });
  });

}
function UpdateBasketQty(el,diff,e){
  let item = $(el).closest(".smu_shop_single_item");
  let inp = $(item).find("input");
  let v = parseInt($(inp).val());
  v = v + diff;
  $(inp).val(v);
  $.get("/WebUpdateSMUBasketQty.hal?uuid=" + $(item).attr("uuid") + "&diff=" + diff,function(){
  });
  if (v<=0) {
    $(item).remove();
  }
  e.stopPropagation();
  UpdateBasket();

}

function SubmitBasket(el){
  this.fdata;
  this.button = el;

  this.Validate = function(){
    var self = this;
    var res = true;
    $(".field_row .field_wrap input").each(function(){
      if ($(this).val()==""){
        res = false;
        $(this).parent().parent().addClass("err");
      }
    })
    $(".field_row .field_wrap *").each(function(){
      self.fdata[$(this).attr("name")] = $(this).val();
    })

    return res;    
  }

  this.Submit = function(){
    this.fdata = {};
    if (this.Validate()){
      $.ajax({
        type: "POST",
        url: "/WebSubmitSMUBasket.hal",
        data: this.fdata,
        success: function(data){
          window.location.href="pabeigts";
        }
      });
    }
  }

  this.Init = function(){
    var self = this;
    $(".field_row .field_col").click(function(){
      $(this).removeClass("err");
    })
    $(this.button).click(function(){
      self.Submit();
    });
  }
  this.Init();
}

$(document).ready(function(){

  listFilter($(".smu_shop_searchbox input"));
  $("#industry_select").on('selectmenuchange',function(){
    $(".smu_shop_searchbox input").change();
  });
  $("#region_select").on('selectmenuchange',function(){
    $(".smu_shop_searchbox input").change();
  });
  $( "#industry_select" ).selectmenu();
  $( "#region_select" ).selectmenu();
  let ms = new MainSearch($(".smu_shop_mainsearch input"));

  if ($(".smu_shop_item_frame.favourites").length>0) {
    $(".smu_shop_item_displayelement div").click(function(){
      $.get("/WebSetBasketView.hal?view=" + $(this).attr("list"),function(){
        window.location.reload();
      });
    });
    $(".smu_shop_item_frame .smu_shop_single_item").click(function(){
      window.open($(this).attr("url"),"_blank");
    });
  }
  if ($(".smu_shop_item_frame.basket").length>0) {
    $(".smu_shop_item_frame .smu_shop_single_item").click(function(){
      window.open($(this).attr("url"),"_blank");
    });
  }
  $(".smu_shop_item_image").each(function(){
    let img = $(this).find("img");
    $(this).html("<a href='" + $(img).attr("link2") + "'>" + $(this).html() + "</a>");
  });
  $(".smu_shop_item_image a").magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		image: {
			verticalFit: true
		}
		
	});
  $(".smu_shop_item_liked").click(function(e){
    uuid = $(this).attr("uuid");
    e.stopPropagation();
    $.get("/WebUpdateSMUProductLike.hal?uuid=" + uuid,function(){
      window.location.reload();
    });
  }) 
  $(".smu_shop_item_basket").click(function(e){
    uuid = $(this).attr("uuid");
    e.stopPropagation();
    $.get("/WebUpdateSMUProductLike.hal?type=basket&uuid=" + uuid,function(){
      window.location.reload();
    });
  });
  $(".basket_back").click(function(){
    window.location.href="/katalogs/grozs";
  })
  $(".step1 .smu_shop_basket_order_button").click(function(){
    window.location.href="grozs/pasutit";
  });
  SubmitBasket($(".step2 .smu_shop_basket_order_button"));
  $(".qty_entry .add").click(function(e){
    UpdateBasketQty(this,1,e);
  });
  $(".qty_entry .remove").click(function(e){
    UpdateBasketQty(this,-1,e);
  });
  $(".basket_finish_button").click(function(){
    window.location.href="/katalogs";
  })
  UpdateBasket();

  SetPagination();
  InitShopEdit();

  InitImageFix();

});

function listFilter(input) {
 
  $(input)
    .change( function () {
      var filter = $(this).val();
      var industry = $("#industry_select").val();
      var region = $("#region_select").val();
      var flist = ".smu_shoplist_hidden .smu_shoplist_smu";
      var flist2 = ".smu_shoplist_hidden .smu_shoplist_smu";
      testf = false;
      if (filter){
        flist+= ":not(:Contains(" + filter + "))";
        flist2+= ":Contains(" + filter + ")";
        testf = true;
      }
      console.log(flist + ":" + flist2);
      $(".smu_shoplist_hidden .smu_shoplist_smu").hide();
      $(flist2).each(function(){//valid searches
        let showf = true;
        if (industry!=""){
          if ($(this).attr("industry")!=industry){
            showf = false;
          }
        }
        if (region!=""){
          if ($(this).attr("region")!=region){
            showf = false;
          }
        }
        if (showf){
          $(this).show();
        }
      });
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

function GetURLParamater(par){
  let searchParams = new URLSearchParams(window.location.search);
  let res = "";
  if (searchParams.get(par)) {
    res = searchParams.get(par);
  }
  return res;
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
  this.shopurl = $(".smu_url");
  this.shipping = $(".smu_shipping");
  this.fb = $(".fbpage input");
  this.contactemail = $(".contactemail input");
  this.logo = $(".shop_logo");
  this.background = $(".shop_background");
  this.items = [];
  this.errorf = false;
  this.RemoveItems = [];
  this.ClearImages = [];

  this.Init = function(){
    var self = this;
    $.get("/WebGetSMUDataForShopEditing.hal" + GetURLParamater("s"),function(data){
      var js = JSON.parse(data);
      self.name.val(js.SMFName);
      self.school.val(js.School);
      self.spec.val(js.ProdSpec);
      self.descr.text(js.Text);
      self.code = js.SMFCode;
      self.status = js.Status;
      if (self.status==1){
        $("<div class='shop_message'>" + jal_str["KatalogsNosutits"] + "</div>").insertAfter(".smu_top");
      }

      self.extpage.val(js.ExtWebPage);
      self.twitter.val(js.TwitterPage);
      self.shopurl.val(js.ShopUrl);
      self.shipping.val(js.Shipping);
      self.instagram.val(js.InstagramPage);
      self.fb.val(js.FacebookPage);
      self.contactemail.val(js.ContactEmail);

      self.origLogo = js.Logo;
      self.origBackground = js.Background;
      self.InitCompanyImage(self.origBackground,self.background,"newBackground",jal_str['Fons']);
      self.InitCompanyImage(self.origLogo,self.logo,"newLogo",jal_str['Logo']);
      self.InitItems(js.items);
      if (self.status==2) {
        $(".smu_submit .save_submit").hide();
      }
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
    var self = this;
    var n = $($(".item_template").html());
    if (item.hasOwnProperty("Logo") && item.Logo!=""){
      $(n).find(".logo_frame").html("<img src='" + item.Logo + "'><div class='edit_image'>" + jal_str['Labot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    } else {
      $(n).find(".logo_frame").html("<div class='empty_img'><div class='text'>" + jal_str["PievienotFoto"] + "</div></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    }
    $(n).find(".remove").click(function(){
      self.RemoveItems.push(item.UUID);
      $(n).remove();
    })
    $(n).data("uuid",item.UUID);
    this.AddItemData(item.Name,n,".name_frame",jal_str["PievienotAprakstu"]);
    this.AddItemData(item.Price,n,".price_frame",jal_str["PievienotCenu"]);

    $(".item_list").append(n);
    this.InitFileUpload($(n).find(".logo_frame"));
}

  this.InitItems = function(items){
    var self = this;
    for (item of items) {
      this.AddSingleItem(item);
    }
    $("<div class='add_item spbutton'>Pievienot Produktu</div>").insertAfter(".item_list");
    $(".add_item").click(function(){
      self.AddSingleItem({Name:"",Price:""});
    });
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
    var self = this;
    el.find(".edit_image").click(function(){
      el.find(".fileupload").click();
    })
    el.find(".fileupload").change(function(){
      let fileupload = this;
      if (this.files.length>0) {
        let file = this.files[0];
        let newf = false;
        if ($(el).closest(".shop_item").length>0) {
          let uuid = $(el).closest(".shop_item").data("uuid");
          if (uuid!="" && uuid!==undefined){
            self.ClearImages.push(uuid);
          }
        }

        let img = el.find("img").get(0);
        if (!img){
          img = document.createElement("img");
          newf = true;
        }
        let reader = new FileReader();
        reader.onloadend = function(readerEvent) {
          img.src = reader.result;


          var thumb_image = new Image();
          thumb_image.onload = function (imageEvent) {

              // Resize the image
              var canvas = document.createElement('canvas'),
                  max_size = 500,// TODO : pull max size from a site config
                  width = thumb_image.width,
                  height = thumb_image.height;
              if (width > height) {
                  if (width > max_size) {
                      height *= max_size / width;
                      width = max_size;
                  }
              } else {
                  if (height > max_size) {
                      width *= max_size / height;
                      height = max_size;
                  }
              }
              canvas.width = width;
              canvas.height = height;
              canvas.getContext('2d').drawImage(thumb_image, 0, 0, width, height);
              if (file.name.substr(-3)=="png") {
                var dataUrl = canvas.toDataURL('image/png', 1);
              } else {
                var dataUrl = canvas.toDataURL('image/jpeg');
              }
              var resizedImage = dataURLToBlob(dataUrl);
              resizedImage.name = "thumb_" + file.name;
              $(fileupload).data("thumb",resizedImage);

          }
          thumb_image.src = readerEvent.target.result;
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

  this.LoadData = function(submitf){
    let data = {};
    data.Text = this.descr.val();
    data.Twitter = this.twitter.val();
    data.Facebook = this.fb.val();
    data.Instagram = this.instagram.val();
    data.ExtWebPage = this.extpage.val();
    data.ContactEmail = this.contactemail.val();
    data.ShopUrl = this.shopurl.val();
    data.Shipping = this.shipping.val();
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
    if (submitf) {
      data.SendForApproval = 1;
    } else {
      data.SendForApproval = 0;
    }
    data.RemoveItems = this.RemoveItems.join(",");
    data.ClearImages = this.ClearImages.join(",");
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
      totfiles++;
      var inp = $(".shop_logo").find(".fileupload").get(0);
      var upl = new FileUpload($(".shop_logo"),inp,"logo",this.code,func,null,$(".shop_logo").find(".fileupload").data("thumb"));      
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
        totfiles++;
        var upl = new FileUpload($(this),inp,"smuitem",nuuid,func,null);      
        var upl = new FileUpload($(this),inp,"smuitem",nuuid,func,null,$(this).find(".fileupload").data("thumb"));      
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
    if (this.status!=0 && this.status!=2) {
      alert(jal_str["NevarLabot"]);
      return;
    }
    if (this.insubmit==false && this.ValidateForm()) {
      this.insubmit = true;
      fdata = this.LoadData(submitf);
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

function MainSearch(el){
  this.el = el;

  this.DoSearch = function(){
    var self = this;
    let filter = $(this.el).val();
    if (filter!="") {
      //filter exiting filter list
      $(".smu_shop_single_item").each(function(){
        if (matchall($(this).html(),filter)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      })
    } else {
      $(".smu_shop_single_item").slideDown();
    }

  }
  this.CloseSearch = function(){
    $(this.el).parent().find(".close_search").remove();
  }

  this.Init = function(){
    var self = this;
    $(this.el).keyup(function(){
      self.DoSearch();
    });
  }
  this.Init();
}