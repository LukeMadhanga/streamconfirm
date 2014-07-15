/**
 * Show an alternative confirm dialogue
 * @param {string} message The message to display
 * @param {function|object} callback The callback function to run when the user clicks okay, or an object in the form
 *  {
 *      'Button Name': function_to_run_on_click,
 *      'Another button name': function_to_run_on_click [, ...]
 *  }
 * @param {string} moreinfo [optional] A short message to display to the user below the main question
 */
var streamConfirm = function (message, callback, moreinfo) {
    
    return new stream_confirm(message, callback, moreinfo);
    
};

/**
 * Show an alternative confirm dialogue
 * @param {string} message The message to display
 * @param {function|object} callback The callback function to run when the user clicks okay, or an object in the form
 *  {
 *      'Button Name': function_to_run_on_click,
 *      'Another button name': function_to_run_on_click [, ...]
 *  }
 * @param {string} moreinfo [optional] A short message to display to the user below the main question
 */
function stream_confirm(message, callback, moreinfo) {
    
    /**
     * An alias to 'this'
     * @type stream_confirm
     */
    var self = this;
    /**
     * The default functions
     */
    self.functions = {
        cancel: function () {
            return 'cancel';
        },
        confirm: function () {
            callback();
            return 'confirm';
        }
    };
    
    /**
     * Build the dialogue
     */
    function build() {
        moreinfo = moreinfo === undefined ? '' : moreinfo;
        $('body').append(
            '<div id="streamconfirm">' + 
                '<div id="streamconfirmover"></div>' + 
                '<div id="streamconfirmmain">' + 
                    '<div id="streamconfirmquest">' + message + '</div>' + 
                    '<div id="streamconfirmmore">' + moreinfo + '</div>' + 
                    '<div id="streamconfirmbtns">' + 
                        getBtns() + 
                    '</div>' + 
                '</div>' + 
            '</div>');
        $('#streamconfirmbtns > span').click(function () {
            var func = $(this).data('caconfirmfunc');
            if (self.functions[func]) {
                $('#streamconfirm').remove();
                return self.functions[func]();
            } else {
                console.error('You have not defined the function "' + func + '"');
            }
        });
         
    };
    
    /**
     * Render the buttons for this confirm dialogue
     * @returns {html}
     */
    function getBtns() {
        var outtext = '';
        if (typeof callback === 'function') {
            self.functions.confirm = callback;
            outtext += '<span data-caconfirmfunc="confirm">Okay</span>';
        } else if (Object.prototype.toString.call(callback) === '[object Object]') {
            // We've been given a list of buttons and functions to run when they're clicked
            for (var x in callback) {
                self.functions[x] = callback[x];
                outtext += '<span data-caconfirmfunc="' + x + '">' + x + '</span>';
            }
            self.functions = callback;
        }
        outtext += '<span data-caconfirmfunc="cancel">Cancel</span>';
        return outtext;
    }
    
    build();
    
}
