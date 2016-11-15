jQuery(document).ready(function($){

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
            $( '#iewp-form-field-form' ).html( data.form.form );
            $( '#iewp-form-field-required' ).html( 'none' );
            var str = '';
            if( data.form.required_fields !== '' )
            {
                str = '<ul class="iewp-form-required-fields-list">';
                var required_fields = JSON.parse( data.form.required_fields );
                $.each(required_fields, function( key, val )
                {
                    str += '<li><code>' + val + '</code></li>';
                });
                str += '</ul>';
            }

            if( str !== '' )
            {
                $( '#iewp-form-field-required' ).html( str );
            }
        }
    })
    .fail(function( data ) {
        console.log( "error" );
    });

});
