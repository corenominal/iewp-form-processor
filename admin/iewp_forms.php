<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * Enqueue additional JavaScript and CSS
 */
function iewp_forms_scripts( $hook )
{

	if( 'toplevel_page_iewp_forms' != $hook )
	{
		return;
	}

	wp_register_style( 'iewp_forms_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_css' );

	wp_register_script( 'iewp_forms_js', plugin_dir_url( __FILE__ ) . 'js/iewp_forms.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'iewp_forms_js' );

}
add_action( 'admin_enqueue_scripts', 'iewp_forms_scripts' );

/**
 * Output HTML
 */
function iewp_forms_callback()
{
	?>
	<div class="wrap">

		<h1>IEWP Forms <a href="admin.php?page=iewp_forms_create" id="add-new-form" class="page-title-action">Add New</a></h1>

		<p>The following forms are set-up and can be processed.</p>

		<table id="iewp-forms" class="forms-list wp-list-table widefat fixed striped posts" data-endpoint="<?php echo site_url('wp-json/iewp_forms/forms_admin') ?>" data-apikey="<?php echo get_option( 'iewp_forms_apikey', '' ); ?>">
        	<thead>
        		<tr>
        			<th class="manage-column column-name column-primary" scope="col">Name</th>
        			<th class="manage-column column-submissions" scope="col">Submissions</th>
					<th class="manage-column column-created" scope="col">Created</th>
        			<th class="manage-column column-options" scope="col">Options</th>
        		</tr>
        	</thead>

        	<tbody id="the-list">
        		<tr><td colspan="4">Loading forms ...</td></tr>
        	</tbody>
        </table>

	</div>
	<?php
}
