var selectsData = [];

var getOptionSelectData = [];


initSocketsForSelect2();

function initSocketsForSelect2() {
  CoCreateSocket.listen('connect', function (data) {
    console.log('socket connected');
    
    socketConnectedForSelect2();
  })
  
  CoCreateSocket.listen('getDocumentList', function(data) {
    fetchedSelectableIdsFromCollection(data);
  })
  
  CoCreateSocket.listen('updateDocument', function(data) {
    fetchedDataForSelect2(data);
  })
  
  CoCreateSocket.listen('getDocument', function(data) {
    fetchedOptionsForSelect2(data);
    fetchedSelectableIdsFromArray(data);
    fetchedDataForSelect2(data);
  })
  
  CoCreateSocket.listen('createDocument', function(data) {
    
  })
}

function socketConnectedForSelect2() {
  initAllSelect2();
}

function initAllSelect2() {
    initOptionSelect2();
    
    selectsData = [];
    
    var forms = document.getElementsByTagName('form');
  
    for (var f=0; f < forms.length; f++) {
      
      var form = forms[f];
      
      initSelect2s(form);
      
      initGetOptionSelects(form);
    }
}

function initOptionSelect2() {
  $('select.' + optionSelect2Class).select2();
}

function initGetOptionSelects(form) {
  var selects = form.querySelectorAll('.' + getOptionSelect2Class);
  
  var collection = form.getAttribute('data-collection');
  collection = collection ? collection: 'module_activity';
  var real_time = form.getAttribute('data-realtime');
  
  if (real_time != 'false') {
    real_time = true;
  } else {
    real_time = false;
  }
  
  for (var i=0; i<selects.length; i++) {
    var select = selects[i];
    var data = [];
   
    var fetchCollection = $(select).attr('data-collection_fetch');
    var data_fetch_name = $(select).attr('data-fetch_name');
    var data_fetch_module_activity_id = $(select).attr('data-fetch_module_activity_id');
    var data_fetch_module_id = $(select).attr('data-fetch_document_id');
    
    var data_module_id = $(select).attr('data-document_id');
    var data_module_activity_id = $(select).attr('data-module_activity_id');
    var name = $(select).attr('name');
    
    var form_id = form.getAttribute('data-form_id');
    
    
    var selectData = {
      fetchCollection: fetchCollection? fetchCollection: 'module_activity',
      data_fetch_name: data_fetch_name,
      data_fetch_module_activity_id: data_fetch_module_activity_id,
      data_fetch_module_id: data_fetch_module_id,
      
      collection: collection,
      data_module_id: data_module_id,
      data_module_activity_id: data_module_activity_id, 
      name: name,
      element: select,
      data: [], 
      gotOptions: false,
      form_id: form_id
    }
    
    getOptionSelectData.push(selectData);
    
    initGetOptionSelect(form, selectData);
    
    fetchOptionsForSelect(selectData);
  }
}

function initGetOptionSelect(form, selectData) {
  var element = selectData['element'];
  var data = selectData['data'];
  
   var real_time = form.getAttribute('data-realtime');
  
  
  $(element).select2({
    data: data,
  });
  
  ///// chage event
  $(element).on('select2:select select2:unselect', function(e) {
    
    var collection = selectData['collection'];

    var data_module_id = selectData['data_module_id']
    var data_module_activity_id = selectData['data_module_activity_id'];
    var name = selectData['name'];
  
    if (real_time != "false") {
      var data = $(element).select2('data');
    
      var value = getSelect2Value(element);
    
      
      var id = collection == 'module_activity' ? data_module_activity_id : data_module_id;
      
      var json = {
        "apiKey": config.apiKey,
        "securityKey": config.securityKey,
        "organization_id": config.organization_Id,
        "data-collection": collection,
        "id": id,
        'data': {
          [name]: value
        }
      };
        
      console.log('emit', json);  
      CoCreateSocket.send('updateDocument', json);
    }  
    
  })
}

function initSelect2s(form) {
  var selects = form.querySelectorAll('.' + select2Class);
  var collection = form.getAttribute('data-collection');
  collection = collection ? collection : 'module_activity';
  var real_time = form.getAttribute('data-realtime');
  
  if (real_time != 'false') {
    real_time = true;
  } else {
    real_time = false;
  }
  
  for (var i=0; i<selects.length; i++) {
    var select = selects[i];
    var data = [];
    
    
    var module_fetch = $(select).attr('data-module_fetch');
    var templateId = $(select).attr('data-template_id');
    var selectedTemplateId = $(select).attr('data-selected_template_id');
    var fetchCollection = $(select).attr('data-collection_fetch');
    var data_module_id = $(select).attr('data-document_id');
    var data_module_activity_id = $(select).attr('data-module_activity_id');
    
    
    var data_fetch_name = $(select).attr('data-fetch_name');
    var data_fetch_module_activity_id = $(select).attr('data-fetch_module_activity_id');
    var data_fetch_module_id = $(select).attr('data-fetch_document_id');
    var data_template_collection = $(select).attr('data-template_collection');
    
    var select_type;
    select_type = (data_fetch_name) ? "array": "collection";
    
    
    
    var name = $(select).attr('name');
    
    
    
    var form_id = form.getAttribute('data-form_id');
    
    if (module_fetch) {
      module_fetch = module_fetch.replace(/\s/g, '').split(',');
    } else {
      module_fetch = [];
    }
    
    var selectData = {
      collection: collection,
      data_module_id: data_module_id,
      data_module_activity_id: data_module_activity_id,
      fetchCollection: fetchCollection? fetchCollection: 'module_activity',
      module_fetch: module_fetch,
      
      data_fetch_name: data_fetch_name,
      data_fetch_module_activity_id: data_fetch_module_activity_id,
      data_fetch_module_id: data_fetch_module_id,
      data_template_collection: data_template_collection ? data_template_collection : 'module_activity',
      select_type: select_type,
      
      name: name,
      element: select,
      data: [], 
      gotSelectableIds: false,
      form_id: form_id
    }
    
    selectsData.push(selectData);
    
    initSelect2(form, selectData);
    
    fetchSelectableIds(selectData);
  }
  
  //console.log(selectsData);
  

}

function initSelect2(form, selectData) {
 
  var element = selectData['element'];
  var data = selectData['data'];
  
   var real_time = form.getAttribute('data-realtime');
  
  
  $(element).select2({
    data: data,
    templateResult: getTemplate,
    templateSelection: templateSelection,
    matcher: matcher
  });
  
  ///// chage event
  $(element).on('select2:select select2:unselect', function(e) {
    
    var collection = selectData['collection'];

    var data_module_id = selectData['data_module_id']
    var data_module_activity_id = selectData['data_module_activity_id'];
    var name = selectData['name'];
  
    if (real_time != "false") {
      var data = $(element).select2('data');
    
      var value = getSelect2Value(element);
    
      
      var id = collection == 'module_activity' ? data_module_activity_id : data_module_id;
      
      var json = {
        "apiKey": config.apiKey,
        "securityKey": config.securityKey,
        "organization_id": config.organization_Id,
        "data-collection": collection,
        "id": id,
        'data': {
          [name]: value
        }
      };
        
      console.log('emit', json);  
      CoCreateSocket.send('updateDocument', json);
    }  
    
  })
}

function fetchOptionsForSelect(selectData) {
  var id = selectData.fetchCollection == 'module_activity' ? selectData.data_fetch_module_activity_id : selectData.data_fetch_module_id;
    
  var json = {
    "apiKey": config.apiKey,
    "securityKey": config.securityKey,
    "organization_id": config.organization_Id,
    "data-collection": selectData.fetchCollection,
    "id": id
  }
  
  CoCreateSocket.send('getDocument', json);
}

function fetchSelectableIds(selectData) {
  console.log(selectData);
  
  if (selectData.select_type == 'collection') {
      var json = {
      "apiKey": config.apiKey,
      "securityKey": config.securityKey,
      "organization_id": config.organization_Id,
      "data-collection": selectData.fetchCollection
    };
    
    CoCreateSocket.send('getDocumentList', json);
    
  } else if(selectData.select_type == 'array') {
    
    var id = selectData.fetchCollection == 'module_activity' ? selectData.data_fetch_module_activity_id : selectData.data_fetch_module_id;
    
    var json = {
      "apiKey": config.apiKey,
      "securityKey": config.securityKey,
      "organization_id": config.organization_Id,
      "data-collection": selectData.fetchCollection,
      "id": id
    }
    
    CoCreateSocket.send('getDocument', json);
  }
}

function fetchedOptionsForSelect2(data) {
  for (var i=0; i < getOptionSelectData.length; i++) {
    var selectData = getOptionSelectData[i];
    var element = selectData.element;
    
    if (!selectData.gotOptions) {
      var id = selectData.fetchCollection == 'module_activity' ? selectData.data_fetch_module_activity_id : selectData.data_fetch_module_id;
      
      if (selectData.fetchCollection == data['data-collection'] && id == data['id']) {
        var data_fetch_name = selectData.data_fetch_name;
        
        if (data_fetch_name in data['result']) {
          var ids = data['result'][data_fetch_name];
          
          console.log(ids);
          
          selectData.data = ids;
          
          $(element).select2({
            data: selectData.data,
          })
          
          selectData.gotOptions = true;
          
          
          
          /////  fetch selected data
          
          var selectId = selectData['collection'] == 'module_activity' ? selectData['data_module_activity_id']: selectData['data_module_id'];
  
          if (selectId) {
            var json = {
              "apiKey": config.apiKey,
              "securityKey": config.securityKey,
              "organization_id": config.organization_Id,
              "data-collection": selectData['collection'],
              "id": selectId
            }
            
            CoCreateSocket.send('getDocument', json);
          }
          
        }
      }
      
    }
  }
}

function fetchedSelectableIdsFromCollection(data) {

  for (var i=0; i < selectsData.length; i++) {
    var selectData = selectsData[i];
    var element = selectData.element;
    
    if (!selectData.gotSelectableIds && selectData.select_type == 'collection') {
    
      if (selectData.fetchCollection == data['data-collection']) {
        var availableItems = [];
        if (data['data-collection'] == 'module_activity') {
          var module_fetch = selectData.module_fetch;
          availableItems = data['result'].filter(function(item) {
            if (module_fetch.length == 0) {
              return true;
            } else if (module_fetch.indexOf(item['data-document_id']) > -1) {
              return true;
            } 
            
            return false;
          })  
        } else {
          availableItems = data.result;
        }
      
        var templateId = element.getAttribute('data-template_id');
        var selectedTemplateId = element.getAttribute('data-selected_template_id');
        var fields = getTemplateFields(templateId, selectedTemplateId);
        
        var data = [];
        
        for (var j=0; j<availableItems.length; j++) {
          data.push({
            collection: selectData.fetchCollection,
            id: availableItems[j]['_id'],
            fields: Object.assign({}, fields),
            templateId: templateId,
            selectedTemplateId: selectedTemplateId
          })
        }
        
        selectData.data = data;
        
  
        
        $(element).select2({
          data: selectData.data,
          templateResult: getTemplate,
          templateSelection: templateSelection,
          matcher: matcher
        })
        
        selectData.gotSelectableIds = true;
        
        fetchSelectData(selectData);
      }
    }
  }
}

function fetchedSelectableIdsFromArray(data) {
  
  for (var i=0; i<selectsData.length; i++) {
    var selectData = selectsData[i];
    var element = selectData.element;
    
    if (!selectData.gotSelectableIds && selectData.select_type == 'array') {
      var id = selectData.fetchCollection == 'module_activity' ? selectData.data_fetch_module_activity_id : selectData.data_fetch_module_id;
      
      if (selectData.fetchCollection == data['data-collection'] && id == data['id']) {
        var data_fetch_name = selectData.data_fetch_name;
        
        if (data_fetch_name in data['result']) {
          var ids = data['result'][data_fetch_name];
          
          var templateId = element.getAttribute('data-template_id');
          var selectedTemplateId = element.getAttribute('data-selected_template_id');
          var fields = getTemplateFields(templateId, selectedTemplateId);
          
          console.log(ids);
          
          var data = [];
          
          for (var j = 0; j < ids.length; j++) {
            data.push({
              collection: selectData.data_template_collection,
              id: ids[j],
              fields: Object.assign({}, fields),
              templateId: templateId,
              selectedTemplateId: selectedTemplateId
            })
          }
          
          selectData.data = data;
          
          $(element).select2({
            data: selectData.data,
            templateResult: getTemplate,
            templateSelection: templateSelection,
            matcher: matcher
          })
          
          selectData.gotSelectableIds = true;
          
          fetchSelectData(selectData);
        }
      }
    }
    
    
  }
}

function fetchSelectData(selectData) {
  var data = selectData['data'];
  
    
  for (var j=0; j<data.length; j++) {
    var tmp = data[j];
    var collection = tmp.collection;
    
    var json = {
      "apiKey": config.apiKey,
      "securityKey": config.securityKey,
      "organization_id": config.organization_Id,
      "data-collection": collection,
      "id": tmp['id']
    };
    
    CoCreateSocket.send('getDocument', json);
    
  }
  
  
  /////   fetch selected value
  
  var selectId = selectData['collection'] == 'module_activity' ? selectData['data_module_activity_id']: selectData['data_module_id'];
  
  if (selectId) {
    var json = {
      "apiKey": config.apiKey,
      "securityKey": config.securityKey,
      "organization_id": config.organization_Id,
      "data-collection": selectData['collection'],
      "id": selectId
    }
    
    CoCreateSocket.send('getDocument', json);
  }
}

function fetchedDataForSelect2(data) {
  
  var data_collection = data['data-collection'];
  
  var forms = document.getElementsByTagName('form');
  
  for (var f=0; f < forms.length; f++) {
    var form = forms[f];
      
    var optionSelect2s = form.querySelectorAll('select.' + optionSelect2Class);
    var form_data_collection = form.getAttribute('data-collection') ? form.getAttribute('data-collection') : 'module_activity';
    
    for (var i=0; i < optionSelect2s.length; i++) {
      var optionSelect2 = optionSelect2s[i];
      
      var data_module_id = optionSelect2.getAttribute('data-document_id');
      var data_module_activity_id = optionSelect2.getAttribute('data-module_activity_id');
      var data_fetch_value = optionSelect2.getAttribute('data-fetch_value');
      var name = optionSelect2.getAttribute('name');
      
      if (data_fetch_value != 'false') {
        
        if (form_data_collection == "module_activity" && data_collection == "module_activity") {     //////    fetch from module activity
          
          if (data_module_activity_id == data['id']) {
            for (var key in data['result']) {
              if (key == name && data['result'][key]) {
                var selectValues = data['result'][key];
        
                $(optionSelect2).val(selectValues).trigger('change');  
              }
            }
          }
        } else if (form_data_collection == data_collection) {                ////   fetch from module
          
          if (data_module_id == data['id']) {
            for (var key in data['result']) {
              if (key == name && data['result'][key]) {
                var selectValues = data['result'][key];
                
        
                $(optionSelect2).val(selectValues).trigger('change');  
              }
            }
          }
        }
      }
      
      updateFloatLabel(optionSelect2, getSelect2Value(optionSelect2));
    }
  }
  
  updateSelectData(data, data_collection);
  
  updatGetOptionSelect(data, data_collection);
}

function updateSelectData(data, data_collection) {

  
  for (var i=0; i<selectsData.length; i++) {
    var tmp = selectsData[i];
    
    for (var j=0; j<tmp.data.length; j++) {
      var item = tmp.data[j];
      
      if (item.id == data['id'] && item.collection == data_collection) {
        for (var key in item.fields) {
          for (var key1 in data['result']) {
            if (key == key1) {
              tmp.data[j].fields[key] = data['result'][key1];
              
              var select = selectsData[i].element;
              var selectData = selectsData[i].data;
              
              $(select).select2({
                data: selectData,
                templateResult: getTemplate,
                templateSelection: templateSelection,
                matcher: matcher
              })
            }  
          }
          
        }
      }
    }
    
    
    //// fetch and update selected value
    if (tmp['collection'] == data_collection) {
      if (tmp['data_module_activity_id'] == data['id'] && data_collection =='module_activity') {
        for (var key in data['result']) {
          if (tmp['name'] == key) {
            var selectedValues = data['result'][key];
            
            console.log('value change')
            
            $(tmp.element).val(selectedValues).trigger('change');    
            
            updateFloatLabel(tmp.element, getSelect2Value(tmp.element));
          }
        }
        
      }  
      
      if (tmp['data_module_id'] == data['id'] && data_collection !='module_activity') {
        for (var key in data['result']) {
          if (tmp['name'] == key) {
            var selectedValues = data['result'][key];
            
            
            $(tmp.element).val(selectedValues).trigger('change');    
            
            updateFloatLabel(tmp.element, getSelect2Value(tmp.element));
          }
        }
      }  
    }
  }
}

function updatGetOptionSelect(data, data_collection) {
  for (var i=0; i< getOptionSelectData.length; i++) {
    var tmp = getOptionSelectData[i];
    
    //// fetch and update selected value
    if (tmp['collection'] == data_collection) {
      if (tmp['data_module_activity_id'] == data['id'] && data_collection =='module_activity') {
        for (var key in data['result']) {
          if (tmp['name'] == key) {
            var selectedValues = data['result'][key];
            
            console.log('value change')
            
            $(tmp.element).val(selectedValues).trigger('change');    
            
            updateFloatLabel(tmp.element, getSelect2Value(tmp.element));
          }
        }
        
      }  
      
      if (tmp['data_module_id'] == data['id'] && data_collection !='module_activity') {
        for (var key in data['result']) {
          if (tmp['name'] == key) {
            var selectedValues = data['result'][key];
            
            
            $(tmp.element).val(selectedValues).trigger('change');    
            
            updateFloatLabel(tmp.element, getSelect2Value(tmp.element));
          }
        }
      }  
    }
  }
}

function matcher(params, data) {
  
  // If there are no search terms, return all of the data
  if ($.trim(params.term) === '') {
    return data;
  }
  
  for (var key in data.fields) {
    var value = data.fields[key].toUpperCase();
    
    if (value.indexOf(params.term.toUpperCase()) > -1 ) {
      return data;
    }
  }
  
  return null;
}

function getTemplate(item) {
  //return item.text;

  if (!item.id) return;
  
  var template = document.getElementById(item.templateId);
  
  template.querySelectorAll('*').forEach(function(element) {
    var name = element.getAttribute('name');
    
    if (item.fields[name] || item.fields[name] == '') element.innerHTML = item.fields[name];
  
  });
  
  return $(template.innerHTML);
  
}

function templateSelection(item) {
  if (!item.id) return;
  
  var template = document.getElementById(item.selectedTemplateId);
  
  template.querySelectorAll('*').forEach(function(element) {
    var name = element.getAttribute('name');
    
    if (item.fields[name] || item.fields[name] == '') element.innerHTML = item.fields[name];
  });
  
  return $(template.innerHTML);
}

function getTemplateFields(templateId, selectedTemplateId) {
  var template = document.getElementById(templateId);
  var selectedTemplate = document.getElementById(selectedTemplateId);
  
  var fields = {};
  
  template.querySelectorAll('*').forEach(function(element) {
    var name = element.getAttribute('name');
    
    fields[name] = '';
  });
  
  selectedTemplate.querySelectorAll('*').forEach(function(element) {
    var name = element.getAttribute('name');
    
    fields[name] = '';
  });
  
  return fields;
}

function getSelect2Value(select) {
  
  
  var selectData = $(select).select2('data');
  
  if (select.hasAttribute('multiple')) {
    var selectedIds = [];
  
    selectData.forEach(function(item) {
      if (item.selected) selectedIds.push(item.id);
    })
    
    return selectedIds;  
  } else {
    return selectData[0]['id'];
  }
  
  
}

function insertCreatedIdToSelect2(data) {
  var form_id = data.form_id;
  
  var form = document.querySelector("form[data-form_id='" + form_id + "']");
  
  if (form) {

    var ids = data.ids;
    
    var collection = form.getAttribute('data-collection');
  
    collection = collection? collection : 'module_activity';
    
    if (collection == 'module_activity') {    //// module activity form
      for (var i=0; i < selectsData.length; i++) {
        var selectData = selectsData[i];
        
        if (form_id == selectData['form_id'] && !selectData['data_module_activity_id']) {
          var data_module_id = selectData['data_module_id'];
          
          for (var j=0; j < ids.length; j++) {
            var id = ids[j];
            
            if (data_module_id == id['data-document_id']) {
              selectData['data_module_activity_id'] = id['id'];
              selectData.element.setAttribute('data-module_activity_id', id['id'])
            }
          }
        }
      }
    } else {
      for (var i=0; i < selectsData.length; i++) {
        var selectData = selectsData[i];
        
        if (form_id == selectData['form_id'] && !selectData['data_module_id']) {
          selectData['data_module_id'] = ids;
          selectData.element.setAttribute('data-document_id', ids)
        }
      }
    }
    
  }
}
//   /*Select2 events With Floating labels*/ 

//   var select2Class = "select2documents";
//   var select2options = "select2options";
//   var optionSelect2Class = "select2getoptions";
  
//   if (node.classList.contains(select2Class) || node.classList.contains(select2options) || node.classList.contains(optionSelect2Class)) {
//     $(node).on('select2:close', function (e) {
//       console.log('event');
//     //node.addEventListener("select2:close", function (e) {
//       var value = $(this).val()
//       var father = $(this).parents('.floating-label')
//       if(value == ''){
//         father.removeClass('active');
//       }
//     });
//     $(node).on('select2:open', function (e) {
//     //node.addEventListener("select2:open", function (e) {
//       var father = $(this).parents('.floating-label')
//       if(!father.hasClass('active'))
//         father.addClass('active');
//     });
//   }
// }
