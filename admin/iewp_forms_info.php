<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * Enqueue additional JavaScript and CSS
 */
function iewp_forms_info_scripts( $hook )
{

	if( 'forms_page_iewp_forms_info' != $hook )
	{
		return;
	}

    wp_register_style( 'iewp_forms_info_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms_info.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_info_css' );

	wp_register_script( 'iewp_forms_info_js', plugin_dir_url( __FILE__ ) . 'js/iewp_forms_info.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'iewp_forms_info_js' );

	wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', 'iewp_forms_info_scripts' );

/**
 * Output HTML
 */
function iewp_forms_info_callback()
{
	?>
	<div class="wrap">

		<h1>IEWP Forms &mdash; <span id="action">Info</span></h1>

		<p>Details for implementing this form from within your theme.</p>

		<div id="iewp-forms-panel" class="iewp-forms-panel">

			<table class="form-table" data-form="<?php echo $_GET['form']; ?>" id="iewp-form-name" data-endpoint="<?php echo site_url('wp-json/iewp_forms/forms_admin') ?>" data-apikey="<?php echo get_option( 'iewp_forms_apikey', '' ); ?>">
				<tbody>

					<tr>
						<th scope="row">endpoint</th>
						<td>
							<code id="iewp-form-endpoint"><?php echo site_url('wp-json/iewp_forms/processor') ?></code>
						</td>
					</tr>

					<tr>
						<th scope="row">form</th>
						<td>
							<code id="iewp-form-field-form"></code>
						</td>
					</tr>

					<tr>
						<th scope="row">required_fields</th>
						<td>
							<span id="iewp-form-field-required"></span>
						</td>
					</tr>

				</tbody>
			</table>

		</div>

	</div>
	<?php
}
