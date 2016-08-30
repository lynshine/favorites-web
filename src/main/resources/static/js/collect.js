$(function(){
	$("#changeModel1").click(function(){
		$("#show2").show();
		$("#model1").hide();
		$("#model2").show();
	});
	
	$("#changeModel2").click(function(){
		$("#show2").hide();
		$("#model2").hide();
		$("#model1").show();
	});
	
	$("#atshow").click(function(){
		if(gfollows.length > 0 && $("#atFriend").is(":hidden")){
			$("#atFriend").show();
		}else{
			$("#atFriend").hide();
		}
	});
	
    $('#atshow').bind('click', function(e) {  
    	if(e.stopPropagation){ 
            e.stopPropagation();
    	}else{ 
           e.cancelBubble = true;
     	} 
    }); 
	
	$("#ccollect").click(function(){
		 if($("#ctitle").val()==""){
			 $("#errorMsg").text("标题不能为空");
			 $("#errorMsg").show();
			 return;
		 }
		 if($("#clogoUrl").val() ==""){
			 $("#errorMsg").text("图片链接不能为空");
			 $("#errorMsg").show();
			 return;
		 }
		  $("#errorMsg").hide();
	  	  $.ajax({
	  	         type: "POST",
	  	         url:"/collect/collect",
	  	         data:$("#collect-form").serialize(),
	  	         success: function(response) { 
	  	        	 if(response.rspCode == '000000'){
	  	        		loadFavorites();
	  					$('#modal-changeSharing').modal('hide');
	  					if($("#userCheck").val()=="usercontent"){
	  						userLocationUrl($("#forward").val(),"userAll");
	  						loadUserFavorites();
	  					}else{
	  						locationUrl($("#forward").val(),"home");
	  					}
	  	        	 }else{
	  	        		$("#errorMsg").text(response.rspMsg);
	 			 		$("#errorMsg").show();
	  	        	 }
	  	         },
	  	         error: function (jqXHR, textStatus, errorThrown) {
	  	        	 console.log(jqXHR.responseText);
	  	        	 console.log(jqXHR.status);
	  	        	 console.log(jqXHR.readyState);
	  	        	 console.log(jqXHR.statusText);
	  	             console.log(textStatus);
	  	             console.log(errorThrown);
	  	         }
	  	     });
		});
});


function showAt(name){
	var text = $("#remark").val();
	$("#remark").val(text + "@" +name + " ").focus();
}

function onCollect(id,user){
	 $('#modal-remove').modal('show');
	 $("#collectId").val(id);
	 $("#userCheck").val(user);
}

function delCollect(){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:"",
			url: '/collect/delete/'+$("#collectId").val(),
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(response){
				loadFavorites();
				if("usercontent" == $("#userCheck").val()){
					userLocationUrl($("#forward").val(),"usereAll");
					loadUserFavorites();
				}else{
					locationUrl($("#forward").val(),"home");
				}
				$('#modal-remove').modal('hide');
			}
		});
}


function getCollect(id,user){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:"",
			url: '/collect/detail/'+id,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(collect){
				$("#ctitle").val(collect.title);
				$("#clogoUrl").val(collect.logoUrl);
				$("#cremark").val(collect.remark);
				$("#ccollectId").val(collect.id);
				$('#modal-changeSharing').modal('show');
				$("#favoritesSelect").val(collect.favoritesId);
				$("#newFavorites").val("");
				$("#userCheck").val(user);
			}
		});
}


function changePrivacy(id,type){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:"",
			url: '/collect/changePrivacy/'+id+'/'+type,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(collect){
				if(type=='public'){
					$("#public"+id).hide();
					$("#private"+id).show();
				}else{
					$("#public"+id).show();
					$("#private"+id).hide();
				}
			}
		});
}


function changeLike(id){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:"",
			url: '/collect/like/'+id,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(like){
				if($("#like"+id).is(":hidden")){ 
					$("#like"+id).show();
					var praiseCount=parseInt($("#praiseC"+id).val())-1;
					$("#praiseC"+id).val(praiseCount);
					$("#likeS"+id).html("点赞("+praiseCount+")");
					$("#likel"+id).show();
					$("#unlike"+id).hide();
					$("#unlikel"+id).hide();
				}else{
					$("#like"+id).hide();
					$("#likel"+id).hide();
					$("#unlike"+id).show();
					$("#unlikel"+id).show();
					var praiseCount=parseInt($("#praiseC"+id).val())+1;
					$("#praiseC"+id).val(praiseCount);
					$("#UNlikeS"+id).html("取消点赞("+praiseCount+")");

				} 
			}
		});
}


function search(){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:"",
			url: '/collect/delete/'+$("#collectId").val(),
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(response){
				locationUrl($("#forward").val(),"home");
				$('#modal-remove').modal('hide');
			}
		});
}


function switchComment(collectId){
	 if($("#collapse"+collectId).hasClass('in')){
		 $("#collapse"+collectId).removeClass('in');
      }else{
    	  showComment(collectId);
      }
}

function showComment(collectId){
	  $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:'',
			url: '/comment/list/'+collectId,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(comments){
				initComment(comments,collectId);
	    	    $("#collapse"+collectId).addClass('in');
			}
		});
}

function initComment(comments,collectId){
	var comment='';
	 $("#commentList"+collectId).html("");
	for(var i=0;i<comments.length;i++){
		var item ='<div class=\"media bb p\"><small class=\"pull-right text-muted\">'+comments[i].commentTime+'</small>';
		item=item+'<div class=\"pull-left\"><img class=\"media-object img-circle thumb32\" src=\"'+comments[i].profilePicture+ '\" /></div> ';
		item=item+'<div class=\"media-body\">  <span class=\"media-heading\">  <p class=\"m0\"> '
		item=item+"<a href=\"javascript:void(0);\" onclick=\"locationUrl('/user/" + comments[i].userId + "')\">"+comments[i].userName+"</a>";
		item=item+'</p> <p class=\"m0 text-muted\">'+comments[i].content+'<small>';
		if(comments[i].userId==$("#userId").val()){
			item=item+"<a href=\"javascript:void(0);\" onclick=\"deleteComment('"+comments[i].id+"','"+collectId+"')\" >    删除</a>";
		}else{
			item=item+"<a href=\"javascript:void(0);\" onclick=\"replyComment('"+comments[i].userName+"','"+collectId+"')\" >    回复</a>";
		}
		item=item+'</small></p></span></div></div>';
		comment=comment+item;
	}
	 $("#commentList"+collectId).append(comment);
}


function comment(collectId){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:'collectId='+collectId+'&content='+$("#commentContent"+collectId).val(),
			url: '/comment/add',
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(response){
				var commentCount=parseInt($("#commentC"+collectId).val())+1;
				$("#commentC"+collectId).val(commentCount);
				$("#commentS"+collectId).html("评论("+commentCount+")");
				$("#commentContent"+collectId).val('');
				showComment(collectId);
			}
		});
}


function deleteComment(id,collectId){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:'',
			url: '/comment/delete/'+id,
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(response){
				var commentCount=parseInt($("#commentC"+collectId).val())-1;
				$("#commentC"+collectId).val(commentCount);
				$("#commentS"+collectId).html("评论("+commentCount+")");
				showComment(collectId);
			}
		});
}

function replyComment(name,collectId){
	var text = $("#commentContent"+collectId).val();
	$("#commentContent"+collectId).val(text + "@" +name + " ").focus();
}


function loadStandardMore(){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:'page='+page,
			url: '/collect/standard/'+$("#pageType").val(),
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(collects){
				listStandardCollect(collects);
				page++;
			}
		});
}



function listStandardCollect(collects){
	if(collects.length==0){
		$("#loadStandardNoMore").show();
		$("#loadStandardMore").hide();
	}
	var collectStandardList='';
	for(var i=0;i<collects.length;i++){
		var item =
		"<li>"+
		"<a style=\"background-image:url("+(collects[i].logoUrl=='' ? 'img/favicon.png' : collects[i].logoUrl )+")\" class=\"hidden-xs timeline-badge sharing-user-avatar\" href=\""+collects[i].url+"\"></a>"+
		"<div class=\"timeline-panel\">"+
		"   <div class=\"popover right\">"+
		"      <div class=\"arrow\"></div>"+
		"      <div class=\"popover-content\">"+
		"         <div class=\"table-grid\">"+
		"            <div class=\"col\">"+
		"               <div class=\"pull-right dropdown dropdown-list\">"+
		"                  ";
		if($("#userId").val() == collects[i].userId){
			item=item+		"   <a href=\"#\" data-toggle=\"dropdown\" class=\"sharing-more-button\"  >"+
			"                                             <span class=\"fa fa-angle-down\"></span>"+
			"                                          </a>";
		}
		item=item+
		"                  "+
		"                  <ul class=\"dropdown-menu animated bounceIn\">"+
		"                     <li>"+
		"                        <div class=\"list-group\">"+
		"                           <a onclick=\"getCollect("+collects[i].id+");\" class=\"list-group-item\" href=\"javascript:void(0);\">"+
		"                              <div class=\"media-box\">"+
		"                                 <div class=\"pull-left\">"+
		"                                    <em class=\"fa fa-pencil-square-o fa-2x fa-fw text-info\"></em>"+
		"                                 </div>"+
		"                                 <div class=\"media-box-body clearfix\">"+
		"                                    <p class=\"m0\">修改收藏</p>"+
		"                                    <p class=\"m0 text-muted\">"+
		"                                       <small>修改收藏的各种属性</small>"+
		"                                    </p>"+
		"                                 </div>"+
		"                              </div>"+
		"                           </a>"+
		"                           <a onclick=\"onCollect("+collects[i].id+");\" class=\"list-group-item\" href=\"javascript:void(0);\">"+
		"                              <div class=\"media-box\">"+
		"                                 <div class=\"pull-left\">"+
		"                                    <em class=\"fa fa-trash fa-2x fa-fw text-danger\"></em>"+
		"                                 </div>"+
		"                                 <div class=\"media-box-body clearfix\">"+
		"                                    <p class=\"m0\">删除</p>"+
		"                                    <p class=\"m0 text-muted\">"+
		"                                       <small>该分享会永久删除</small>"+
		"                                    </p>"+
		"                                 </div>"+
		"                              </div>"+
		"                           </a>"+
		"                        </div>"+
		"                     </li>"+
		"                  </ul>"+
		"               </div>"+
		"               <div class=\"m0\">"+
		"                  <a onclick=\"locationUrl(\'/user/"+collects[i].userId+"\',\'\');\" class=\"text-muted\" href=\"javascript:void(0);\">"+collects[i].userName+"</a>"+
		"                  ";
		if($("#userId").val() == collects[i].userId){
			item=item+" <a onclick=\"changePrivacy("+collects[i].id+",\'private\');\" style=\"display:"+(collects[i].type=='private' ? 'none' : 'inline-block')+"\" id=\"private"+collects[i].id+"\" href=\"javascript:void(0);\" title=\"设为私密\" class=\"deco-none\">"+
			"                <span style=\"color: #eee;\" class=\"fa fa-lock\"></span>"+
			"              </a>";
			item=item+" <a onclick=\"changePrivacy("+collects[i].id+",\'public\');\" style=\"display:"+(collects[i].type=='public' ? 'none' : 'inline-block')+"\" id=\"public"+collects[i].id+"\" href=\"javascript:void(0);\" title=\"设为公开\" class=\"deco-none\">"+
			"                <span class=\"fa fa-lock text-warning\"></span>"+
			"              </a>";
		}
		item=item+
 
		"                  "+
		"                  <small class=\"ml-sm text-muted\">"+collects[i].collectTime+"</small>"+
		"               </div>"+
		"            </div>"+
		"         </div>"+
		"          <div class=\"m0\">"+replaceEmpty(collects[i].remark)+"</div>"+
		"         <div class=\"media resource-card-thumbnail\">"+
		"            <a href=\""+collects[i].url+"\" target=\"_blank\" class=\"pull-left\">"+
		"               <div style=\"background-image:url("+(collects[i].logoUrl=='' ? 'img/favicon.png' : collects[i].logoUrl )+")\" class=\"media-object resource-card-image\"></div>"+
		"            </a>"+
		"            <div class=\"media-body\">"+
		"               <h4 class=\"visible-xs media-heading resource-card-title-xs\">"+
		"                  <a href=\""+collects[i].url+"\" target=\"_blank\">"+collects[i].title+"</a>"+
		"               </h4>"+
		"               <h3 class=\"hidden-xs media-heading resource-card-title\">"+
		"                  <a href=\""+collects[i].url+"\" target=\"_blank\">"+collects[i].title+"</a>"+
		"               </h3>"+
		"               <div class=\"hidden-xs resource-card-content\">"+
		"                  <p>"+collects[i].description+"</p>"+
		"               </div>"+
		"            </div>"+
		"         </div>"+
		"         <div class=\"m0\">"+
		"            <span class=\"icon-folder mr-sm\"></span>"+
		"            <a onclick=\"locationUrl(\'/standard/"+collects[i].favoriteId+"\',\'"+collects[i].favoriteId+"\');\" class=\"normal-color-a ng-binding\" href=\"javascript:void(0);\">"+collects[i].favoriteName+"</a>"+
		"            <div class=\"pull-right hidden-xxs\">"+
		"               <small>"+
		"                  <a class=\"sharing-action-button\">"+
		"                     <span class=\"fa fa-share-alt\"></span>"+
		"                     	分享"+
		"                  </a>"+
		"                   <if style=\"display:"+(collects[i].Praise ? 'none' : 'inline-block')+"\" id=\"likel"+collects[i].id+"\"> "+
		"				     | "+
		"				  </if> "+
		"                  <a onclick=\"changeLike("+collects[i].id+");\" style=\"display:"+(collects[i].praise? 'none' : 'inline-block')+"\" id=\"like"+collects[i].id+"\" class=\"sharing-action-button\">"+
		"                     <span class=\"fa fa-thumbs-o-up\"></span>"+
		"                     <show id=\"likeS"+collects[i].id+"\">点赞("+collects[i].praiseCount+")</show>"+
		"                  </a>"+
		"                   <if style=\"display:"+(collects[i].Praise ? 'inline-block' : 'none')+"\" id=\"unlikel"+collects[i].id+"\"> "+
		"				     | "+
		"				  </if> "+
		"                  <a onclick=\"changeLike("+collects[i].id+");\" style=\"display:"+(collects[i].praise? 'inline-block' : 'none')+"\" id=\"unlike"+collects[i].id+"\" class=\"sharing-action-button\">"+
		"                     <span class=\"fa fa-thumbs-up\"></span>"+
		"                  	 <show id=\"unlikeS"+collects[i].id+"\">取消点赞("+collects[i].praiseCount+")</show>"+
		"                  </a>"+
		"                  <input type=\"hidden\" value=\"1\" id=\"praiseC"+collects[i].id+"\" name=\"praiseC\">"+
		"                  <input type=\"hidden\" value=\"6\" id=\"commentC"+collects[i].id+"\" name=\"commentC\">"+
		"                  | "+
		"                  <a onclick=\"switchComment("+collects[i].id+");\" href=\"javascript:void(0);\" class=\"sharing-action-button btn-comment\">"+
		"                     <span class=\"fa fa-comment-o\"></span>"+
		"                     <show id=\"commentS"+collects[i].id+"\">评论("+collects[i].commentCount+")</show>"+
		"                  </a>"+
		"				  <if> "+
		"				     | "+
		"				  </if> "+
		"                  <a class=\"sharing-action-button\">"+
		"                     <span class=\"fa fa-spoon\"></span>"+
		"                   	    收藏"+
		"                  </a>"+
		"               </small>"+
		"            </div>"+
		"         </div>"+
		"         <div id=\"collapse"+collects[i].id+"\" class=\"collapse\">"+
		"            <comments id=\"commentList"+collects[i].id+"\"></comments>"+
		"            <div id=\"comment"+collects[i].id+"\" class=\"media p0\">"+
		"               <div class=\"media-body\">"+
		"                  <form>"+
		"                     <div class=\"input-group\">"+
		"                        <input type=\"text\" id=\"commentContent"+collects[i].id+"\" class=\"form-control\" placeholder=\"输入评论...\">"+
		"                        <span class=\"input-group-btn\">"+
		"                           <button onclick=\"comment("+collects[i].id+");\" type=\"button\" class=\"btn btn-default\">发送</button>"+
		"                        </span>"+
		"                     </div>"+
		"                  </form>"+
		"               </div>"+
		"            </div>"+
		"         </div>"+
		"      </div>"+
		"   </div>"+
		"</div>"+
		"</li>";
		collectStandardList=collectStandardList+item;
	}
	 $("#collectStandardList").append(collectStandardList);
}


function loadSimpleMore(){
	 $.ajax({
			async: false,
			type: 'POST',
			dataType: 'json',
			data:'page='+page,
			url: '/collect/simple/'+$("#pageType").val(),
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			},
			success: function(collects){
				listSimpleCollect(collects);
				page++;
			}
		});
}


function listSimpleCollect(collects){
	var collectSimpleList='';
	if(collects.length==0){
		$("#loadSimpleNoMore").show();
		$("#loadSimpleMore").hide();
	}
	for(var i=0;i<collects.length;i++){
		var item =
			"<tr>"+
			"    <td>"+
			"      <a href=\""+collects[i].url+"\" style=\"font-size:16px;color:#656565;\" target=\"_blank\">"+collects[i].title+"</a>"+
			"    </td>"+
			"   <td width=\"10%\" class=\"text-center\">"+
			"     <img height=\"25px\" width=\"35px\" src=\""+(collects[i].logoUrl=='' ? 'img/favicon.png' : collects[i].logoUrl )+"\" alt=\"\"></td>"+
			"   <td width=\"15%\" class=\"text-center\">"+
			"    <div>"+
			"    <a onclick=\"getCollect("+collects[i].id+");\" class=\"mr\" href=\"javascript:void(0);\"> <i class=\"fa fa-pencil\"></i>"+
			"    </a>"+
			"    <a onclick=\"onCollect("+collects[i].id+");\" class=\"ml\" href=\"javascript:void(0);\"> <i class=\"fa fa-trash text-danger\"></i>"+
			"    </a>"+
			"    </div>"+
			"   </td>"+
			" </tr>";
		collectSimpleList=collectSimpleList+item;
	}
	 $("#collectSimpleList").append(collectSimpleList);
}





