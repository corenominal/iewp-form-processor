jQuery(document).ready(function($)
{
    /**
	 * List submissions
	 */
    function get_subs()
    {
        $( '.tablenav-pages-navspan' ).prop('disabled', 'disabled');
        var endpoint = $( '#iewp-forms-submissions' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms-submissions' ).data( 'apikey' ),
            action: 'list_subs',
            offset: $( '#iewp-forms-submissions' ).data( 'offset' ),
            limit: $( '#iewp-forms-submissions' ).data( 'limit' ),
            form: $( '#iewp-forms-submissions' ).data( 'form' )
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var items = data.total.submissions;
            $( '.displaying-num' ).html( items + ' items' );

            // Paging
            if( items > 0 )
            {
                $( '.iewp-forms-remove-all-subs' ).removeProp( 'disabled' );
                var limit = $( '#iewp-forms-submissions' ).data( 'limit' );
                var pages = Math.ceil( items / limit );
                $( '#iewp-forms-submissions' ).data( 'pages', pages );
                $( '#iewp-forms-submissions' ).data( 'total', items );
                var offset = $( '#iewp-forms-submissions' ).data( 'offset' );
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

            var subs = '';
			if( data.num_rows == 0 )
			{
				subs = '<tr><th colspan="4">No data found!</th></tr>';
			}
			else
			{
				$.each(data.subs, function(i, sub)
				{
                    subs += '<tr class="sub" data-id="' + sub.id + '">';
                    subs += '<th class="check-column"><input class="iewp-forms-remove-sub" type="checkbox" value="' + sub.id + '"></th>';
                    subs += '<td class="iewp-forms-sub">' + sub.name + '</td>';
					subs += '<td class="iewp-forms-sub">' + sub.created + '</td>';
                    subs += '<td class="iewp-forms-sub">' + sub.ip + '</td>';
					subs += '</tr>';
				});
			}
			$( '#the-list' ).html( subs );
        })
        .fail(function( data ) {
            console.log( "error" );
        });
    }

    get_subs();

    /**
     * Paging
     */
    $( document ).on( 'click', '.page-first', function( e )
    {
        e.preventDefault();
        $( '#iewp-forms-submissions' ).data( 'offset', 0 );
        on_page();
    });

    $( document ).on( 'click', '.page-prev', function( e )
    {
        e.preventDefault();
        var offset = $( '#iewp-forms-submissions' ).data( 'offset' );
        var limit = $( '#iewp-forms-submissions' ).data( 'limit' );
        offset = offset - limit;
        $( '#iewp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-last', function( e )
    {
        e.preventDefault();
        var pages = $( '#iewp-forms-submissions' ).data( 'pages' );
        var limit = $( '#iewp-forms-submissions' ).data( 'limit' );
        var offset = ( pages * limit ) - limit;
        $( '#iewp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    $( document ).on( 'click', '.page-next', function( e )
    {
        e.preventDefault();
        var offset = $( '#iewp-forms-submissions' ).data( 'offset' );
        var limit = $( '#iewp-forms-submissions' ).data( 'limit' );
        offset = offset + limit;
        $( '#iewp-forms-submissions' ).data( 'offset', offset );
        on_page();
    });

    function on_page()
    {
        get_subs();
        $( '#iewp-forms-checkall-subs' ).prop( 'checked', false );
        $( '.iewp-forms-remove-selected-subs' ).prop('disabled', 'disabled');
    }

    /**
     * View data
     */
    $( document ).on( 'click', '.iewp-forms-sub', function( e )
    {
        e.preventDefault();
        var id = $( this ).closest( 'tr' ).data( 'id' );

        if( $( "#iewp-forms-submission-details-" + id ).length )
        {
            $( '.iewp-forms-submission-details' ).remove();
            return;
        }

        $( '.iewp-forms-submission-details' ).remove();

        var row = '<tr id="iewp-forms-submission-details-' + id + '" class="iewp-forms-submission-details"><th colspan="4"><div class="">Retrieving data ...</div></td></tr>';
        $( this ).closest( "tr" ).after( row );
        var endpoint = $( '#iewp-forms-submissions' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms-submissions' ).data( 'apikey' ),
            action: 'get_sub',
            id: id
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            var sub = JSON.parse( data.sub.data );
            var details = '';
            $.each(sub, function(key, val)
            {
                details += '<strong>' + key + ':</strong> ' + val + '<br>';
            });
            $( '.iewp-forms-submission-details div' ).html( details );
        })
        .fail(function( data ) {
            console.log( "error" );
        });
    });

    /**
     * Select all rows
     */
    $( document ).on( 'click', '#iewp-forms-checkall-subs', function( e )
    {
        if( $( this ).is( ':checked' ) )
        {
            $( '.iewp-forms-remove-sub' ).prop( 'checked', true );
            $( '.iewp-forms-remove-selected-subs' ).removeProp('disabled');
        }
        else
        {
            $( '.iewp-forms-remove-sub' ).prop( 'checked', false );
            $( '.iewp-forms-remove-selected-subs' ).prop('disabled', 'disabled');
        }
    });

    /**
     * Select row
     */
    $( document ).on( 'click', '.iewp-forms-remove-sub', function( e )
    {
        $( '#iewp-forms-checkall-subs' ).prop( 'checked', false );
        var nochecks = true;
        $( '.iewp-forms-remove-sub' ).each(function(i, el) {
            if( $( this ).is( ':checked' ) )
            {
                nochecks = false;
            }
        });
        if( nochecks == false )
        {
            $( '.iewp-forms-remove-selected-subs' ).removeProp('disabled');
        }
        else
        {
            $( '.iewp-forms-remove-selected-subs' ).prop('disabled', 'disabled');
        }
    });

    /**
     * Remove selected subs
     */
    $( document ).on( 'click', '.iewp-forms-remove-selected-subs', function( e )
    {
        e.preventDefault();
        tb_show("","#TB_inline?height=150&amp;width=405&amp;inlineId=iewp-forms-notify-remove-selected&amp;modal=true",null);

    });

    $( document ).on( 'click', '#iewp-forms-confirm-remove-selected-subs', function( e )
    {
        e.preventDefault();
        $( this ).prop('disabled', 'disabled');
        var subs = [];
        $( '.iewp-forms-remove-sub' ).each(function(i, el) {
            if( $( this ).is( ':checked' ) )
            {
                subs.push( $( this ).val() );
            }
        });
        var endpoint = $( '#iewp-forms-submissions' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms-submissions' ).data( 'apikey' ),
            action: 'remove_selected_subs',
            subs: subs,
            form: $( '#iewp-forms-submissions' ).data( 'form' )
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            get_subs();
            var total = data.total;
            var offset = $( '#iewp-forms-submissions' ).data( 'offset' );
            var limit = $( '#iewp-forms-submissions' ).data( 'limit' );
            if ( total == 0 )
            {
                window.location.href = "admin.php?page=iewp_forms";
                return;
            }
            if ( offset >= total )
            {
                offset = offset - limit;
                $( '#iewp-forms-submissions' ).data( 'offset', offset );
                on_page();
            }
            $( '.iewp-forms-remove-selected-subs' ).prop('disabled', 'disabled');
            $( '#iewp-forms-checkall-subs' ).prop( 'checked', false );
            $( '#iewp-forms-confirm-remove-selected-subs' ).removeProp('disabled');
            tb_remove();
        })
        .fail(function() {
            console.log( "error" );
        });

    });

    /**
     * Remove all subs
     */
    $( document ).on( 'click', '.iewp-forms-remove-all-subs', function( e )
    {
        e.preventDefault();
        tb_show("","#TB_inline?height=150&amp;width=405&amp;inlineId=iewp-forms-notify-remove-all&amp;modal=true",null);

    });

    $( document ).on( 'click', '#iewp-forms-confirm-remove-all-subs', function( e )
    {
        e.preventDefault();
        $( this ).prop('disabled', 'disabled');
        var endpoint = $( '#iewp-forms-submissions' ).data( 'endpoint' );
        var data = {
            apikey: $( '#iewp-forms-submissions' ).data( 'apikey' ),
            action: 'remove_all_subs',
            form: $( '#iewp-forms-submissions' ).data( 'form' )
        };
        $.ajax({
            url: endpoint,
            type: 'GET',
            dataType: 'json',
            data: data
        })
        .done(function( data ) {
            window.location.href = "admin.php?page=iewp_forms";
        })
        .fail(function() {
            console.log( "error" );
        });

    });

    $( document ).on( 'click', '.iewp-thickbox-dismiss-button', function( e )
    {
        e.preventDefault();
        tb_remove();
    });

});
