$(document).ready(function() {
	var base_url = $('#base_url').val();
	var paraIdArray = [];
	var search_string = '';
	var paragraphsArray = [];

  $('.open-modal').live('click', function(){
    var ticket_id = $(this).data('id');
    $('#ticket_id').val(ticket_id);
    $('#reply_modal').modal('show');

    paraIdArray = [];
    $('#search_heading').val('');
    $('.options-div').hide();
    $('.paragraph-content-div').html('');

    $('#message').val('');

    $('#reply_files_upload').val('');
    $('#reply-files-list').text('');
    
    getAdminMessage({ticket_id:ticket_id});
    $('.msg-content-div').html($(this).parent().siblings(".messages").html());
  });

  $('#reply-btn').live('click', function(){
    var ticket_id = $(this).data('id');
    $('#ticket_id').val(ticket_id);
    $('#reply_modal').modal('show');

    paraIdArray = [];
    $('#search_heading').val('');
    $('.options-div').hide();
    $('.paragraph-content-div').html('');

    $('#reply_files_upload').val('');
    $('#reply-files-list').text('');

    getAllWhatsAppsTickets({ticket_id:ticket_id});
  });

  $('#reply_files_upload').change(function(){
    var files = $(this)[0].files;
    var fileSelected = (files.length) ? ((files.length > 1) ? files.length+' files selected' : files.length+' file selected') : '';
    $('#reply-files-list').text(fileSelected);
  });

  function getFormattedMessages(messages, ticket_id){
    var msgHtml = '';
    messages.filter(item=>{
      var className = (item.sent_by == 2) ? 'pull-right reciever' : 'sender';
      msgHtml += '<div class="row"><article class="col-xs-12"><section><blockquote class="no-margin '+className+'">';
      if(item.msg_text){
        msgHtml +='<p>'+item.msg_text+'</p>'
      }

      if(item.attchment_name){
        // msgHtml +='<p><a target="_blank" href="'+item.attchment_name+'">View attatchment</a></p>';
        msgHtml +='<p><a class="image-caurosel" data-id="'+ticket_id+'" data-toggle="modal">View attatchment</a></p>';
      }

      if(item.sent_by == 2){
        msgHtml +=  '<small><strong><span class="elusive icon-ok"></span><span class="elusive icon-ok"></span></strong></small>';
      }
      else{
        if(item.msg_status != 3){
          msgHtml += '<small><strong><span class="elusive icon-ok">';
          if(item.delivery_status == 1){
            msgHtml += '<span class="btn btn-primary btn-xs check_status" data-id="'+item.chat_id+'" data-original-title="Check delevery status">Pending</span>';
          }
          else{
            msgHtml += '<span class="elusive icon-ok">';
          }
          msgHtml += '</strong></small>';
        }
      }
      msgHtml +=  '<small>'+((item.sent_by == 1) ? ((item.admin_name) ? ( item.admin_name+ '-') : '') : '')+'<strong>'+item.created_date+'</strong></small>'+
            '</blockquote></section></article></div>';
    });
    return msgHtml;
  }

	$('.options-div').hide();
    $("#search_heading").typeahead({
    	autoSelect:false,
        source: function (request, response) {
        	search_string = request;
          $.ajax({
            url: base_url+"clinic/WhatsAppChats/get_para_data",
            data: { name: request},
            type: "POST",
            success: function (data) {
            	data = JSON.parse(data);
            	var para_heading = data.result.para_heading;
            	var paragraphs = data.result.paragraphs;
                items = [];
                map = {};
                $.each(para_heading, function (i, item) {
                  map[item.h_name] = { id: item.h_id, name: item.h_name };
                  items.push(item.h_name);
                });
                response(items);
                $(".dropdown-menu").css("height", "auto");
                paragraphsArray = paragraphs;
                $('.options-div').show();
                $('.paragraph-content-div').html(updateParagraphs(paragraphs));
            },
            error: function (data) {
              alert(data.message);
            },
            failure: function (response) {
              alert(data.message);
            }
          });
        },
        updater: function (item) {
          var id = map[item].id;
          $.ajax({
            url: base_url+"clinic/WhatsAppChats/get_paragraphs",
            data: { id: id},
            type: "POST",
            success: function (data) {
            	data = JSON.parse(data);
            	var result = data.result;
            	paragraphsArray = result;
            	$('.options-div').show();
            	$('.paragraph-content-div').html(updateParagraphs(result));
            },
            error: function (data) {
              alert(data.message);
            },
            failure: function (response) {
              alert(data.message);
            }
          });
          return item;
        }
    });

    $("#reply").live('click', function(){
    	var message = $('#message').val();
      var file_data = $('#reply_files_upload').prop('files'); 
    	var errCount = 0;
		  if (!file_data.length && message == '') {
	    	showHideErrors('.message_err', 'Message is required');
        errCount++;
	    }

    	if (errCount < 1) {
        var ticket_id = $('#ticket_id').val();
        var form_data = new FormData();
        form_data.append('ticket_id', ticket_id);
        form_data.append('message', message);
        form_data.append('status', 'reply');
        if(file_data.length){
          for (var index = 0; index < file_data.length; index++) {
            form_data.append("files[]", file_data[index]);
          }
        }
        else{
          form_data.append("files[]", '');
        }
        replyToTicket(form_data, this);
    	}
    });

    $('.paragraph-content-div').scroll(function() {
      if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        var offset = $(".paragraph-content-div p").length;
        var postData = {offset: offset, name:search_string};
        loadResults(postData); 
      }
	}); 

	$('.paragraph-checkbox').live('click', function(){
		var is_message = $(this).is(":checked");
		var p_id = $(this).attr('id');
		if(is_message){
			paraIdArray.push(p_id);
			paragraphsArray.filter(item=>{
				if(item.p_id == p_id){
					var htmlString = item.paragraph;
					var textareaText = ($('#message').val()) ? ($('#message').val() + htmlString) : htmlString;
					$('#message').val(textareaText);
				}
			});
		}
		else{
			paraIdArray = jQuery.grep(paraIdArray, function(value) {
			  return value != p_id;
			});
		}
	});

	$('#clear').live('click', function(){
		$('#message').val('');
		paraIdArray = [];
	});

	$('#save').live('click', function(){
		var message = $('#message').val();
      var file_data = $('#reply_files_upload').prop('files'); 
    	var errCount = 0;
		  if (!file_data.length && message == '') {
        showHideErrors('.message_err', 'Message is required');
        errCount++;
      }
      else if(file_data.length && message == ''){
        showHideErrors('.message_err', 'Message is required');
        errCount++;
      }

    	if (errCount < 1) {
        var ticket_id = $('#ticket_id').val();
        var form_data = new FormData();
        form_data.append('ticket_id', ticket_id);
        form_data.append('message', message);
        form_data.append('status', 'saved');
        if(file_data.length){
          for (var index = 0; index < file_data.length; index++) {
            form_data.append("files[]", file_data[index]);
          }
        }
        else{
          form_data.append("files[]", '');
        }
    		replyToTicket(form_data, this);
    	}
	});

	function updateParagraphs(paragraphs){
  	var paragraphsHtml = '';
  	paragraphs.filter(item =>{
  		if(paraIdArray.length){
  			var is_checked = false
  			paraIdArray.filter(paraId=>{
  				if(item.p_id == paraId){
  					is_checked = true;
  				}
  			});
  		}
      paragraphsHtml += '<input type="checkbox" class="paragraph-checkbox" id="'+item.p_id+'" name="'+item.p_id+'" value="'+item.p_id+'" '+((is_checked) ? 'checked = "checked"' : '')+'>'+item.paragraph +'<hr>';
    });
    return paragraphsHtml;
  }
	
	function replyToTicket(data, element){
		$.ajax({
    	url: base_url+"clinic/WhatsAppChats/reply_to_ticket",
    	type: 'post',
    	cache: false,
      dataType: 'text',
      contentType: false,
      processData: false,
      data: data,
      enctype: 'multipart/form-data',
    	beforeSend: function(){
  		  if(element){
          $(element).attr("disabled", true);
          $(element).html("Please wait...");
  		  }
      },
    	success: function(response) {
    		response = JSON.parse(response);
    		if(response.status == 200){
          var result = response.result;
    			$('#msg-status-'+result.ticket_id).text(getMsgStatus(result.type));
          if(result.type == 'reply'){
            $('#status-'+result.ticket_id).val('closed');
          }
    		}
        var alert_type = (response.status == 200) ? "alert-success" : "alert-danger";
        showAlert(alert_type, response.message);
    	},
      complete:function(){
    		if(element){
          var btnName = ($(element).attr('id') == 'reply') ? 'Reply' : 'Save';
    			$(element).attr("disabled", false);
        	$(element).html(btnName);
      	}

        paraIdArray = [];
        $('#search_heading').val('');
        $('.options-div').hide();
        $('.paragraph-content-div').html('');
      	$('#add-template-form').trigger('reset');
    		$('#reply_modal').modal('hide');
    	}
    });
	}

  function loadResults(postData) {
    $.ajax({
      url: "<?php echo ci_base_url();?>clinic/WhatsAppChats/loadMoreParagraphs",
      type: "post",
      data: postData,
      success: function(data) {
      	data = JSON.parse(data);
      	if (data.status == 200) {
        	var result = data.result;
        	if(result){
        		paragraphsArray.concat(paragraphs);
        		$('.paragraph-content-div').append(updateParagraphs(result));
        	}
      	}    
      }
    });
  }

	function getMsgStatus(msg_status){
		var status = '';
		if(msg_status == 'reply'){
			status = 'Sent';
		}
		else if(msg_status == 'saved'){
			status = 'Saved';
		}
		return status;
	}

	function showHideErrors(element, message){
		$(element).show().text(message)
		setTimeout(function(){
			$(element).hide().text('');
		},5000);
	}

  function showAlert(alert_type, message){
      $('.message_box').show();
      $('.message_box').addClass(alert_type);
      $('#whatsapp_alert_message').text('');
      $('#whatsapp_alert_message').text(message);
      var scrollPos =  $(".message_box").offset().top;
      $(window).scrollTop(scrollPos);
      setTimeout(function(){
        $('.message_box').hide();
      },5000);
    }

  function getAdminMessage(data){
      $.ajax({
          url: base_url+"clinic/WhatsAppChats/get_admin_message",
            type: 'get',
            data: data,
            success: function(data) {
              data = JSON.parse(data);
              if(data.status == 200){
                var result = data.result;
                var htmlString = result.msg_text;
                $('#message').val(htmlString);
              }
            }
        });
    }

  function getAllWhatsAppsTickets(data){
    $.ajax({
      url: base_url+"clinic/WhatsAppChats/getAllMessagesAgainstTicketId",
        type: 'get',
        data: data,
        success: function(data) {
          data = JSON.parse(data);
            if (data.status == 200) {
              if(data.result){
                var userMessages = data.result.userMessages;
                var adminMessage = data.result.adminMessage;
                $('.msg-content-div').html(getFormattedMessages(userMessages));
                if(adminMessage.length){
                  var htmlString = adminMessage[0].msg_text;
                  $('#message').val(htmlString);
                }
              }
            }
        }
    });
  }
});