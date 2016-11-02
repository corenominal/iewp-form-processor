jQuery(document).ready(function($){

    /**
     * Test for valid email
     * See: http://stackoverflow.com/posts/46181/revisions
     */
    function validateEmail( email )
    {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Test for form
     */
    var endpoint = $( '#iewp-form-name' ).data( 'endpoint' );
    var apikey = $( '#iewp-form-name' ).data( 'apikey' );
    var data = {
        apikey: apikey,
        action: 'get_form',
        form: $( '#iewp-form-name' ).data( 'form' )
    };
    $.ajax({
        url: endpoint,
        type: 'GET',
        dataType: 'json',
        data: data
    })
    .done(function( data ) {
        if( data.error )
        {
            window.location.href = "admin.php?page=iewp_forms";
        }
        else
        {
            $( '#iewp-form-name' ).val( data.form.name );

            if( data.form.required_fields !== '' )
            {
                var required_fields = JSON.parse( data.form.required_fields );
                $.each(required_fields, function( key, val )
                {
                    $( '#required-fields-list' ).append( '<li data-value="' + val + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.to_recipients !== '' )
            {
                var to_recipients = JSON.parse( data.form.to_recipients );
                $.each(to_recipients, function( key, val )
                {
                    $( '#to-recipients-list' ).append( '<li data-value="' + val + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.cc_recipients !== '' )
            {
                var cc_recipients = JSON.parse( data.form.cc_recipients );
                $.each(cc_recipients, function( key, val )
                {
                    $( '#cc-recipients-list' ).append( '<li data-value="' + val + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }

            if( data.form.bcc_recipients !== '' )
            {
                var bcc_recipients = JSON.parse( data.form.bcc_recipients );
                $.each(bcc_recipients, function( key, val )
                {
                    $( '#bcc-recipients-list' ).append( '<li data-value="' + val + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + val + '</li> ' );
                });
            }
        }
    })
    .fail(function( data ) {
        console.log( "error" );
    });

    /**
     * Remove list item
     */
    $( document ).on('click', '.iewp-form-li-del-button', function( e )
    {
        e.preventDefault();
        $(this).parents("li:first").remove();
        $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
    });

    $( document ).on( 'change keyup', '.iewp-form-input', function()
    {
        $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
    });

    /**
     * Add required field list item
     */
    $( document ).on('click', '#iewp-forms-add-required-field-button', function( e )
    {
        e.preventDefault();
        var str = $( '#iewp-form-required-field-input' ).val().trim().toLowerCase();
        str = str.replace( /[^0-9a-z_]/gi, '' );

        if( str === '' )
        {
            $( '#iewp-form-required-field-input' ).val( '' );
            $( '#iewp-form-required-field-input' ).focus();
            return;
        }

        var dup = false;
        $( '#required-fields-list li' ).each(function( i )
        {
            test = $( this ).data( 'value' );
            if( test === str )
            {
                dup = true;
            }
        });

        if( dup === false )
        {
            $( '#required-fields-list' ).append( '<li data-value="' + str + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + str + '</li> ' );
            $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
        }

        $( '#iewp-form-required-field-input' ).val( '' );
        $( '#iewp-form-required-field-input' ).focus();
    });

    /**
     * Add to_recipients
     */
    $( document ).on('click', '#iewp-forms-add-to-recipients-button', function( e )
    {
        e.preventDefault();
        var email = $( '#iewp-form-to-recipients-input' ).val().trim();

        if( email === '' || validateEmail(email) === false )
        {
            $( '#iewp-form-to-recipients-input' ).val( '' );
            $( '#iewp-form-to-recipients-input' ).focus();
            return;
        }

        var dup = false;
        $( '#to-recipients-list li' ).each(function( i )
        {
            test = $( this ).data( 'value' );
            if( test === email )
            {
                dup = true;
            }
        });

        if( dup === false )
        {
            $( '#to-recipients-list' ).append( '<li data-value="' + email + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
            $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
        }

        $( '#iewp-form-to-recipients-input' ).val( '' );
        $( '#iewp-form-to-recipients-input' ).focus();
    });

    /**
     * Add cc_recipients
     */
    $( document ).on('click', '#iewp-forms-add-cc-recipients-button', function( e )
    {
        e.preventDefault();
        var email = $( '#iewp-form-cc-recipients-input' ).val().trim();

        if( email === '' || validateEmail(email) === false )
        {
            $( '#iewp-form-cc-recipients-input' ).val( '' );
            $( '#iewp-form-cc-recipients-input' ).focus();
            return;
        }

        var dup = false;
        $( '#cc-recipients-list li' ).each(function( i )
        {
            test = $( this ).data( 'value' );
            if( test === email )
            {
                dup = true;
            }
        });

        if( dup === false )
        {
            $( '#cc-recipients-list' ).append( '<li data-value="' + email + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
            $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
        }

        $( '#iewp-form-cc-recipients-input' ).val( '' );
        $( '#iewp-form-cc-recipients-input' ).focus();
    });

    /**
     * Add bcc_recipients
     */
    $( document ).on('click', '#iewp-forms-add-bcc-recipients-button', function( e )
    {
        e.preventDefault();
        var email = $( '#iewp-form-bcc-recipients-input' ).val().trim();

        if( email === '' || validateEmail(email) === false )
        {
            $( '#iewp-form-bcc-recipients-input' ).val( '' );
            $( '#iewp-form-bcc-recipients-input' ).focus();
            return;
        }

        var dup = false;
        $( '#bcc-recipients-list li' ).each(function( i )
        {
            test = $( this ).data( 'value' );
            if( test === email )
            {
                dup = true;
            }
        });

        if( dup === false )
        {
            $( '#bcc-recipients-list' ).append( '<li data-value="' + email + '"><span class="iewp-form-li-del-button" tabindex="0">X</span> ' + email + '</li> ' );
            $( '#iewp-form-save-form' ).removeAttr( 'disabled' );
        }

        $( '#iewp-form-bcc-recipients-input' ).val( '' );
        $( '#iewp-form-bcc-recipients-input' ).focus();
    });

    /**
     * Save form
     */
    $( document ).on( 'click', '#iewp-form-save-form', function( e )
    {
        e.preventDefault();

        var id = $( '#iewp-form-name' ).data( 'form' );
        console.log( id );

        var name = $( '#iewp-form-name' ).val();
        console.log( name );

        var required_fields = [];
        $( '#required-fields-list li' ).each(function( i )
        {
            required_fields.push( $( this ).data( 'value' ) );
        });
        required_fields = JSON.stringify( required_fields );
        console.log( required_fields );

        var to_recipients = [];
        $( '#to-recipients-list li' ).each(function( i )
        {
            to_recipients.push( $( this ).data( 'value' ) );
        });
        to_recipients = JSON.stringify( to_recipients );
        console.log( to_recipients );

        var cc_recipients = [];
        $( '#cc-recipients-list li' ).each(function( i )
        {
            cc_recipients.push( $( this ).data( 'value' ) );
        });
        cc_recipients = JSON.stringify( cc_recipients );
        console.log( cc_recipients );

        var bcc_recipients = [];
        $( '#bcc-recipients-list li' ).each(function( i )
        {
            bcc_recipients.push( $( this ).data( 'value' ) );
        });
        bcc_recipients = JSON.stringify( bcc_recipients );
        console.log( bcc_recipients );

    });

});
