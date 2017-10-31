/*$.validity.setup({
    // You may change the output mode with this property.
    outputMode: "label",

    // The this property is set to true, validity will scroll the browser viewport
    // so that the first error is visible when validation fails.
    scrollTo: false,

    // If this setting is true, modal errors will disappear when they are clicked on.
    modalErrorsClickable: true,

    // If a field name cannot be otherwise inferred, this will be used.
    defaultFieldName: "This field"
});*/
         

/*(function(){
    // The output mode will be named whatever you assign it to.
    // In this example, since we're assigning it to 'myOutputMode'
    // it will be called 'myOutputMode'.
    $.validity.outputs.myOutputMode = {
    
        // The start function will be called when validation starts.
        // This allows you to prepare the page for validation, for instance
        // you might remove any validation messages that are already on the page.
        start:function(){ 
        
        },
        
        // The end function is called when validation has concluded.
        // This allows you to flush any buffers or do anything you need to
        // after all of the validators have been called.
        // results will be the results object.
        // results.valid is a boolean representing whether the form is valid.
        // results.errors is an integer of how many errors there are.
        end:function(results) { 
        
        },
        
        // The raise function is called to raise an error for a specific input.
        // The first argument is a jQuery object of the input to raise the error message for.
        // The second argument is the string of the error message.
        raise:function($obj, msg){
        
        },
        
        // The raiseAggregate function is similar to the raise function, except that
        // the $obj argument will be a jQuery object of several inputs, 
        // all of which are invalid aggregately.
        raiseAggregate:function($obj, msg){ 
        
        },
    }
})();*/


//First install the new output mode:
(function(){
    // We'll decide to install our custom output mode under the name 'custom':
    $.validity.outputs.custom = { 
        // In this case, the start function will just reset the inputs:
        start:function(){ 
            $("input:text")
                .css({border:'1px solid green'})
                .removeClass('fail');   
        },
        end:function(results) { 
            // If not valid and scrollTo is enabled, scroll the page to the first error.
            if (!results.valid && $.validity.settings.scrollTo) {
                location.hash = $(".fail:eq(0)").attr('id')
            }
        },
        
        // Our raise function will display the error and animate the text-box:
        raise:function($obj, msg){
            // Make the JavaScript alert box with the message:
            alert(msg);
            // Animate the border of the text box:
            $obj
                .animate({ borderWidth: "10px" }, 1000)
                .css({borderColor:'red'})
                .addClass('fail'); 
        },
        
        // Our aggregate raise will just raise the error on the last input:
        raiseAggregate:function($obj, msg){ 
        
            this.raise($($obj.get($obj.length - 1)), msg); 
            
        }
    }
})();

// Now enable the output mode we just installed.
//$.validity.setup({ outputMode:'custom' });

// Our custom output mode is installed and will be used whenever Validity is run.
