jQuery(document).ready(function($)
{
    /**
	 * List forms
	 */
    function get_forms()
    {
        var endpoint = $( '#iewp-forms' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms' ).data( 'apikey' ),
            action: 'list_forms'
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var forms = '';
			if( data.num_rows == 0 )
			{
				forms = '<tr><td colspan="4">No forms found!</td></tr>';
			}
			else
			{
				$.each(data.forms, function(i, form)
				{
					forms += '<tr><td>' + form.name + '</td>';
	        		forms += '<td>' + form.submissions + '</td>';
					forms += '<td>' + form.created + '</td>';
                    forms += '<td class="iewp-form-form-options-cell' + form.id + '">';
                    forms += '<button data-id="' + form.id + '" class="button iewp-forms-edit-form-button">Edit</button> ';
                    forms += '<button data-id="' + form.id + '" class="button iewp-forms-edit-form-button">Info</button> ';
					forms += '<button data-id="' + form.id + '" class="button iewp-forms-remove-form-button">Remove</button>';
					forms += '<div class="remove-form-prompt remove-form-prompt' + form.id + '">';
					forms += '<span>This action cannot be undone and any associated submissions will be deleted. Are you sure?</span>';
					forms += '<button data-id="' + form.id + '" class="button remove-form-prompt-yes">Yes</button> ';
					forms += '<button data-id="' + form.id + '" class="button remove-form-prompt-no">No</button>';
					forms += '</div>';
					forms += '</td></tr>';
				});
			}
			$( '#the-list' ).html( forms );
        })
        .fail(function( data ) {
            console.log( "error" );
        });
    }

    get_forms();

    /**
	 * Edit carousel
	 */
	$( document ).on( 'click', '.iewp-forms-edit-form-button', function( e )
	{
		e.preventDefault();
		var id = $( this ).attr( 'data-id' );
        window.location.href = "admin.php?page=iewp_forms_edit&form=" + id;
	});

    /**
	 * Remove carousel from list
	 */
	$( document ).on( 'click', '.iewp-forms-remove-form-button', function( e )
	{
		e.preventDefault();
		var id = $( this ).attr( 'data-id' );
		$( '.remove-form-prompt' ).not( '.remove-form-prompt' + id ).slideUp();
		$( '.remove-form-prompt' + id ).slideToggle();
	});

    $( document ).on( 'click', '.remove-form-prompt-no', function( e )
	{
		e.preventDefault();
		$( '.remove-form-prompt' ).slideUp();
	});

    $( document ).on( 'click', '.remove-form-prompt-yes', function( e )
	{
		e.preventDefault();
		var endpoint = $( '#iewp-forms' ).data( 'endpoint' );
		var data = {
			action: 'delete_form',
			id: $( this ).attr( 'data-id' ),
            apikey: $( '#iewp-forms' ).data( 'apikey' )
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
            var carousels = '<tr><td colspan="4">Refreshing ...</td></tr>';
			$( '#the-list' ).html( carousels );
			get_forms();
		})
		.fail(function()
		{
			console.log("OH NOES! AJAX error");
		});
	});

});
