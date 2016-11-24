jQuery(document).ready(function($)
{
    /**
	 * List forms
	 */
    function get_forms()
    {
        $( '.tablenav-pages-navspan' ).prop('disabled', 'disabled');
        var endpoint = $( '#iewp-forms' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms' ).data( 'apikey' ),
            action: 'list_forms',
            offset: $( '#iewp-forms' ).data( 'offset' ),
            limit: $( '#iewp-forms' ).data( 'limit' )
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var forms = '';
            var items = data.total;

            // Paging
            $( '.displaying-num' ).html( items + ' items' );
            if( data.num_rows === 0 && data.total > 0 )
            {
                var offset = $( '#iewp-forms' ).data( 'offset' );
                var limit = $( '#iewp-forms' ).data( 'limit' );
                offset = offset - limit;
                $( '#iewp-forms' ).data( 'offset', offset );
                get_forms();
                return;
            }
            if( items > 0 )
            {
                var limit = $( '#iewp-forms' ).data( 'limit' );
                var pages = Math.ceil( items / limit );
                $( '#iewp-forms' ).data( 'pages', pages );
                $( '#iewp-forms' ).data( 'total', items );
                var offset = $( '#iewp-forms' ).data( 'offset' );
                var page = (offset + limit) / limit;
                $( '.current-page' ).html( page );
                $( '.total-pages' ).html( pages );

                if( page < pages )
                {
                    $( '.page-next' ).removeProp('disabled');
                    $( '.page-last' ).removeProp('disabled');
                }

                if( page > 1 )
                {
                    $( '.page-prev' ).removeProp('disabled');
                    $( '.page-first' ).removeProp('disabled');
                }

            }
            else
            {
                $( '.tablenav-pages-navspan' ).prop('disabled', 'disabled');
            }

            if( items == 0 )
			{
				forms = '<tr><td colspan="4">No forms found!</td></tr>';
			}
			else
			{
				$.each(data.forms, function(i, form)
				{
					forms += '<tr><td>' + form.name + '</td>';
                    if( form.submissions == '0' )
                    {
                        forms += '<td>' + form.submissions + '</td>';
                    }
                    else
                    {
                        forms += '<td><a href="admin.php?page=iewp_forms_submissions&name=' + form.name + '&form=' + form.id + '">' + form.submissions + '</a></td>';
                    }
					forms += '<td>' + form.created + '</td>';
                    forms += '<td class="iewp-form-form-options-cell' + form.id + '">';
                    forms += '<button data-id="' + form.id + '" class="button iewp-forms-edit-form-button">Edit</button> ';
                    forms += '<button data-id="' + form.id + '" class="button iewp-forms-info-form-button">Info</button> ';
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
	 * Edit form
	 */
	$( document ).on( 'click', '.iewp-forms-edit-form-button', function( e )
	{
		e.preventDefault();
		var id = $( this ).attr( 'data-id' );
        window.location.href = "admin.php?page=iewp_forms_edit&form=" + id;
	});

    /**
	 * Remove form from list
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
            var forms = '<tr><td colspan="4">Refreshing ...</td></tr>';
			$( '#the-list' ).html( forms );
			get_forms();
		})
		.fail(function()
		{
			console.log("OH NOES! AJAX error");
		});
	});

    /**
	 * Get form info
	 */
	$( document ).on( 'click', '.iewp-forms-info-form-button', function( e )
	{
        e.preventDefault();
		var id = $( this ).attr( 'data-id' );
        window.location.href = "admin.php?page=iewp_forms_info&form=" + id;
	});

    /**
     * Paging
     */
    $( document ).on( 'click', '.page-first', function( e )
    {
        e.preventDefault();
        $( '#iewp-forms' ).data( 'offset', 0 );
        on_page();
    });

    $( document ).on( 'click', '.page-prev', function( e )
    {
        e.preventDefault();
        var offset = $( '#iewp-forms' ).data( 'offset' );
        var limit = $( '#iewp-forms' ).data( 'limit' );
        offset = offset - limit;
        $( '#iewp-forms' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-last', function( e )
    {
        e.preventDefault();
        var pages = $( '#iewp-forms' ).data( 'pages' );
        var limit = $( '#iewp-forms' ).data( 'limit' );
        var offset = ( pages * limit ) - limit;
        $( '#iewp-forms' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-next', function( e )
    {
        e.preventDefault();
        var offset = $( '#iewp-forms' ).data( 'offset' );
        var limit = $( '#iewp-forms' ).data( 'limit' );
        offset = offset + limit;
        $( '#iewp-forms' ).data( 'offset', offset );
        on_page();
    });

    function on_page()
    {
        get_forms();
    }

});
