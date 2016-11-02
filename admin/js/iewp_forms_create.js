jQuery(document).ready(function($){

    $( document ).on( 'submit', '#create-form-form', function( e )
	{
		e.preventDefault();

        $( '#create-form-notify' ).html('');
        $( '#create-form-form #submit' ).attr( 'disabled', 'disabled' );

		var name = $( '#form_name' ).val().trim();
        $( '#form_name' ).val( name );
        var endpoint = $( '#create-form-form' ).data( 'endpoint' );
		var data = {
			action: 'create_form',
            apikey: $( '#create-form-form' ).data( 'apikey' ),
            name: name
        };
        $.ajax(
		{
			url: endpoint,
			type: 'GET',
			dataType: 'json',
			data: data
		})
		.done(function( data )
		{
            if( data.error)
            {
                $( '#create-form-notify' ).html( '<div id="message" class="error notice"><p>Error: ' + data.error + '</p></div>' );
                $( '#create-form-form #submit' ).removeAttr( 'disabled' );
            }
            else
            {
                window.location.href = "admin.php?page=iewp_forms_edit&form=" + data.id;
            }
		})
		.fail(function()
		{
			console.log("OH NOES! AJAX error");
		});

	});

});
