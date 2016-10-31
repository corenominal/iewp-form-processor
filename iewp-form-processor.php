<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }
/**
 * Plugin Name: IEWP Form Processor
 * Plugin URI: https://github.com/corenominal/iewp-form-processor
 * Description: A form processor plugin for WordPress
 * Author: Philip Newborough
 * Version: 0.0.1
 * Author URI: https://corenominal.org
 */

/**
 * Plugin activation functions
 */
function iewp_form_processor_activate()
{
   require_once( plugin_dir_path( __FILE__ ) . 'activation/db.php' );
   require_once( plugin_dir_path( __FILE__ ) . 'activation/create-api-key.php' );
}
register_activation_hook( __FILE__, 'iewp_form_processor_activate' );
