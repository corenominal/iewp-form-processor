<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }
/**
 * Register endpoints
 */
function iewp_forms_register_endpoints()
{
    // endpoint:/wp-json/iewp_forms/forms_admin
    register_rest_route( 'iewp_forms', '/forms_admin', array(
        'methods' => 'GET',
        'callback' => 'iewp_forms_admin',
		'show_in_index' => false,
    ));
}
add_action( 'rest_api_init', 'iewp_forms_register_endpoints' );

/**
 * Include endpoints for the above registrations
 */
require_once( plugin_dir_path( __FILE__ ) . 'forms_admin.php' );
