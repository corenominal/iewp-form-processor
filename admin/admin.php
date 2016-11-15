<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * WP admin pages for creating creating and managing forms.
 */
function iewp_forms_admin_options()
{
	// Add top level page
	add_menu_page(
		'IEWP Forms', // page title
		'Forms', // menu title
		'edit_plugins', // capability
		'iewp_forms', // slug
		'iewp_forms_callback', // callback
		'dashicons-forms', // icon - 20x20 png or SVG - for dashicon just ref the icon 'dashicons-sos'
		22 //position
	);

	add_submenu_page(
		'iewp_forms', // parent slug
		'All Form', // page title
		'All Forms', // menu title
		'edit_plugins', // capability
		'iewp_forms', // slug
		'iewp_forms_callback' // callback function
	);

	add_submenu_page(
		'iewp_forms', // no parent slug (removes from menu) admin.php?page=iewp_forms_edit
		'Forms - Edit', // page title
		'Edit', // menu title
		'edit_plugins', // capability
		'iewp_forms_edit', // slug
		'iewp_forms_edit_callback' // callback function
	);

	add_submenu_page(
		'iewp_forms', // no parent slug (removes from menu) admin.php?page=iewp_forms_edit
		'Forms - Info', // page title
		'Info', // menu title
		'edit_plugins', // capability
		'iewp_forms_info', // slug
		'iewp_forms_info_callback' // callback function
	);

	add_submenu_page(
		'iewp_forms', // parent slug
		'Forms - Add New', // page title
		'Add New', // menu title
		'edit_plugins', // capability
		'iewp_forms_create', // slug
		'iewp_forms_create_callback' // callback function
	);

}
add_action( 'admin_menu', 'iewp_forms_admin_options' );

/**
 * Include admin views
 */
require_once( plugin_dir_path( __FILE__ ) . 'iewp_forms.php' );
require_once( plugin_dir_path( __FILE__ ) . 'iewp_forms_create.php' );
require_once( plugin_dir_path( __FILE__ ) . 'iewp_forms_edit.php' );
require_once( plugin_dir_path( __FILE__ ) . 'iewp_forms_info.php' );
//require_once( plugin_dir_path( __FILE__ ) . 'iewp_form_submissions.php' );

/**
 * Enqueue additional JavaScript and CSS
 */
function iewp_forms_enqueue_css( )
{
	wp_register_style( 'iewp_forms_all_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms_all.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_all_css' );
}
add_action( 'admin_enqueue_scripts', 'iewp_forms_enqueue_css' );
