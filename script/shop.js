
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

function ShowBackToCatalogButton(){
  $(".catalog_back_frame").show();
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

function SetItemPreviewImage(el,i){
  let img = document.createElement("img");
  img.src = $(el).attr("src");
  $(img).addClass("loading");
  console.log(el);
  $(img).on("load",function(){
    $(img).removeClass("loading");
    $(".item_gallery .small_preview").html("").append(img);
    $(".item_gallery .small_preview").append("<div class='before'></div><div class='after'></div><div class='show'></div>");
    let cnt = $(".item_gallery .item_image_list .single_item_image").length;
    let bf = i-1;
    if (bf<0){
      bf = cnt-1;
    }
    let af = i+1;
    if (af==cnt){
      af = 0;
    }
    let tbf = bf*2;
    let taf = af*2;
    console.log(bf + ":" + af + ":" + cnt + ":" + i);
    $(".item_gallery .small_preview .before").click(function(){
      SetItemPreviewImage($(".item_gallery .item_image_list .single_item_image:nth-child(" + (tbf+1) + ")"),bf);
    });
    $(".item_gallery .small_preview .after").click(function(){
      SetItemPreviewImage($(".item_gallery .item_image_list .single_item_image:nth-child(" + (taf+1) + ")"),af);
    });
    $(".item_gallery .small_preview .show").click(function(){
      $(".item_gallery .item_image_list .hidden_item_image:nth-child(" + ((i*2)+2) + ")").click();
    });
  })
  $(document.body).append(img);
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
    ShowBackToCatalogButton();
  }
  if ($(".smu_shop_item_frame.basket").length>0) {
    $(".smu_shop_item_frame .smu_shop_single_item").click(function(){
      window.open($(this).attr("url"),"_blank");
    });
    ShowBackToCatalogButton();
  }
  $(".smu_shop_item_image").each(function(){
    let img = $(this).find("img");
    $(this).html($(this).html());
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
    e.preventDefault()
    $.get("/WebUpdateSMUProductLike.hal?uuid=" + uuid,function(){
      window.location.reload();
    });
  }) 
  $(".smu_shop_item_basket").click(function(e){
    uuid = $(this).attr("uuid");
    e.stopPropagation();
    e.preventDefault()
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
  if ($(".smu_shop_single_item_frame").length>0){
    $(".item_gallery .item_image_list .single_item_image").each(function(index){
      (function(el,tindex){
        $(el).click(function(){
          SetItemPreviewImage(el,tindex);
        });
      })(this,index);
    });
    SetItemPreviewImage($(".item_gallery .item_image_list .single_item_image:first-child"),0);
    $(".item_add_basket").click(function(e){
      uuid = $(this).attr("uuid");
      e.stopPropagation();
      let color = "";
      if ($(".item_dimension.color .item_dim_values .dim.selected").length>0){
        color = $(".item_dimension.color .item_dim_values .dim.selected").attr("color").substring(1);
      };
      let size = "";
      if ($(".item_dimension.size select").length>0){
        size = $(".item_dimension.size select").val();
      };
      $.get("/WebUpdateSMUProductLike.hal?type=basket&uuid=" + uuid + "&size=" + size + "&color=" + color,function(){
        window.location.reload();
      });
    });
    $(".similar_products_list").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]    
    });
    $(".item_dimension.color .item_dim_values .dim:first-child").addClass("selected");
    $(".item_dimension.color .item_dim_values .dim").click(function(){
      $(".dim.selected").removeClass("selected");
      $(this).addClass("selected");
    });
  }  
  UpdateBasket();

  SetPagination();
  InitShopEdit();

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
  this.youtube = $(".youtubepage input");
  this.shopurl = $(".smu_url");
  this.shipping = $(".smu_shipping");
  this.fb = $(".fbpage input");
  this.contactemail = $(".contactemail input");
  this.logo = $(".shop_logo");
  this.background = $(".shop_background");
  this.items = [];
  this.employees = [];
  this.errorf = false;
  this.RemoveItems = [];
  this.ClearImages = [];
  this.ClearEmpImages = [];

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
      self.youtube.val(js.Youtube);
      self.shipping.val(js.Shipping);
      self.instagram.val(js.InstagramPage);
      self.fb.val(js.FacebookPage);
      self.contactemail.val(js.ContactEmail);

      self.origLogo = js.Logo;
      self.origBackground = js.Background;
      self.InitCompanyImage(self.origBackground,self.background,"newBackground",jal_str['Fons']);
      self.InitCompanyImage(self.origLogo,self.logo,"newLogo",jal_str['Logo']);
      self.InitItems(js.items);
      self.InitEmployees(js.employees);
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

  this.addSingleItemImages = function(n,item,i){
    var self = this;
    let tmp = $("<div class='single_image'><img src='" + item.images[i].url + "'><div class='img_remove'></div></div>");
    $(tmp).find(".img_remove").click(function(){
      self.ClearImages.push(item.UUID + "|" + item.images[i].name);
      $(tmp).remove();
    });
    $(n).find(".img_list").append(tmp);
  }

  this.AddSingleColor = function(n,color){
    $(n).find(".colorlist .placeholder").remove();
    let tmp = $("<div class='color'><div class='color_icon' style='background:" + color.Code + "'></div><div class='color_name'>" + color.Name + "</div><div class='remove_color'></div></div>");
    $(n).find(".colorlist").append(tmp);
    $(tmp).find(".remove_color").click(function(){
      $(tmp).remove();
    });
    $(tmp).data("Code",color.Code);
    $(tmp).data("Name",color.Name);

  }

  this.CreateColorElement = function(n,item){
    var self = this;
    for (let i in item.Colors) {
      this.AddSingleColor(n,item.Colors[i]);
    }
    $(n).find(".colorlist").append("<div class='add_color'>+</div>");
    $(n).find(".add_color").click(function(){
      let tmp = $("<div class='new_color'><div class='color_wrap'><input type='text' class='color_icon'></div><div class='color_input'><input  placeholder='Krāsas nosaukums' type='text'></div><div class='submit'>Pievienot</div><div class='cancel'>Atcelt</div></div>");
      $(tmp).find(".cancel").click(function(){
        $(tmp).remove();
      })
      $(tmp).find(".submit").click(function(){
        let cc = $(n).find(".new_color");
        let color = {};
        color.Code = $(cc).find(".color_wrap input").val();
        color.Name = $(cc).find(".color_input input").val();
        if (color.Name=="") {
          $(cc).find(".color_input input").focus();
        } else {
          self.AddSingleColor(n,color);
          $(tmp).remove();
        }
      })
      $(tmp).find(".color_icon").spectrum();
      $(tmp).insertAfter($(n).find(".colorlist"));
    })

  }

  this.AddSingleItem = function(item){
    var self = this;
    var n = $($(".item_template").html());
    if (item.images.length>0){
      $(n).find(".logo_frame").html("<div class='img_list'></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' multiple='true' class='fileupload'>");
    } else {
      $(n).find(".logo_frame").html("<div class='empty_img'><div class='img_list'></div><div class='text'>" + jal_str["PievienotFoto"] + "</div></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' multiple='true' class='fileupload'>");
    }
    for (let i in item.images) {
      self.addSingleItemImages(n,item,i);
    }
    (n).find(".remove_item").click(function(){
      self.RemoveItems.push(item.UUID);
      $(n).remove();
    });
    
    $(n).data("uuid",item.UUID);
    $(n).find(".name input").val(item.Name);
    $(n).find(".short input").val(item.Short);
    $(n).find(".price input").val(item.Price);
    $(n).find(".newprice input").val(item.NewPrice);
    $(n).find(".sizelist input").val(item.SizeList);
    $(n).find(".notinstock input").prop("checked",item.NotInStock==1);
    $(n).find(".text textarea").val(item.Text);
    this.CreateColorElement(n,item);

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
      self.AddSingleItem({Name:"",Price:"",images: []});
    });
  }

  this.AddSingleEmployee = function(employee){
    var self = this;
    var n = $($(".employee_template").html());
    if (employee.hasOwnProperty("Image") && employee.Image!=""){
      $(n).find(".logo_frame").html("<img src='" + employee.Image + "'><div class='edit_image'>" + jal_str['Labot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    } else {
      $(n).find(".logo_frame").html("<div class='empty_img'><div class='text'>" + jal_str["PievienotFoto"] + "</div></div><div class='edit_image'>" + jal_str['Pievienot'] + "</div><input style='display:none' type='file' class='fileupload'>");
    }
    $(n).data("uuid",employee.UUID);
    $(n).find(".name_frame").html(employee.Name);
    $(n).find(".title_frame").html(employee.Title);

    $(".employee_list").append(n);
    this.InitFileUpload($(n).find(".logo_frame"));
  }


  this.InitEmployees = function(employees){
    for (employee of employees) {
      this.AddSingleEmployee(employee);
    }
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
        for (let i=0;i<this.files.length;i++) {
          let file = this.files[i];
          let newf = false;
          let itemf = false;
          let itembody;
          if ($(el).closest(".shop_item").length>0) {
            itemf = true;
            itembody = $(el).closest(".shop_item");
          }
          /*
          if ($(el).closest(".shop_item").length>0) {
            let uuid = $(el).closest(".shop_item").data("uuid");
            let name = $(el).closest(".shop_item").data("imgname");
            if (uuid!="" && uuid!==undefined){
              self.ClearImages.push(uuid + "|" + name);
            }
          }
          */
          if ($(el).closest(".shop_employee").length>0) {
            let uuid = $(el).closest(".shop_employee").data("uuid");
            if (uuid!="" && uuid!==undefined){
              self.ClearEmpImages.push(uuid);
            }
          }
          let img = el.find("img").get(0);
          if (!img || itemf){
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
                let thumblist = $(fileupload).data("thumb");
                if (!thumblist) {
                  thumblist = [];
                }
                thumblist.push(resizedImage);
                $(fileupload).data("thumb",thumblist);

            }
            thumb_image.src = readerEvent.target.result;
          }
          reader.readAsDataURL(file);   
          if (newf) {
            el.find(".empty_img").remove();
            if (itemf) {
              let tmp = $("<div class='single_image'><div class='img_remove'></div></div>");
              $(tmp).prepend(img);
              $(itembody).find(".img_list").append(tmp);
            } else {
              el.prepend(img);
            }
          }  
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
      item.Name = $(this).find(".name input").val();
      item.Short = $(this).find(".short input").val();
      item.Price = $(this).find(".price input").val();
      item.NewPrice = $(this).find(".newprice input").val();
      item.Text = $(this).find(".text textarea").val();
      item.SizeList = $(this).find(".sizelist input").val();
      item.NotInStock = $(this).find(".notinstock input").is(":checked")?1:0;
      item.Colors = [];
      $(this).find(".color").each(function(){
        let c = this;
        item.Colors.push({Code: $(c).data("Code"), Name: $(c).data("Name")})
      })
      if (item.Name!=""){
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
    data.Youtube = this.youtube.val();
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
    data.ClearEmpImages = this.ClearEmpImages.join(",");
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
        totfiles = totfiles + inp.files.length;
        totfiles = totfiles + inp.files.length;
        var upl = new FileUpload($(this),inp,"smuitem",nuuid,func,null);  
        let thumblist = $(this).find(".fileupload").data("thumb");
        for (let j in thumblist) {
          var upl = new FileUpload($(this),inp,"smuitem",nuuid,func,null,thumblist[j]); 
        }     
      }
      i++;
    });
    $(".employee_list .shop_employee").each(function(){
      if ($(this).find(".fileupload").get(0).files.length>0) {
        let uuid = $(this).data("uuid");
        if (uuid!==undefined && uuid!=""){
          nuuid = uuid;
        } else {
          nuuid = list[i];
        }
        var inp = $(this).find(".fileupload").get(0);
        totfiles++;
        var upl = new FileUpload($(this),inp,"smuemp",nuuid,func,null);      
      }
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