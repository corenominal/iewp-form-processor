<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * Enqueue additional JavaScript and CSS
 */
function iewp_forms_edit_scripts( $hook )
{

	if( 'forms_page_iewp_forms_edit' != $hook )
	{
		return;
	}

    wp_register_style( 'iewp_forms_all_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms_all.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_all_css' );

    wp_register_style( 'iewp_forms_edit_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms_edit.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_edit_css' );

	wp_register_script( 'iewp_forms_edit_js', plugin_dir_url( __FILE__ ) . 'js/iewp_forms_edit.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'iewp_forms_edit_js' );

	wp_enqueue_media();
}
add_action( 'admin_enqueue_scripts', 'iewp_forms_edit_scripts' );

/**
 * Output HTML
 */
function iewp_forms_edit_callback()
{
	?>
	<div class="wrap">

		<h1>IEWP Forms &mdash; <span id="action">Edit</span></h1>

		<p>Use the form below to edit this form's attributes.</p>

		<div id="iewp-slick-options-panel" class="iewp-slick-options-panel">
			<table class="form-table">
				<tbody>
                    <tr>
						<th scope="row">Form name</th>
						<td>
							<input data-form="<?php echo $_GET['form']; ?>" type="text" class="regular-text iewp-form-input iewp-form-name" id="iewp-form-name" spellcheck="true" autocomplete="off" data-endpoint="<?php echo site_url('wp-json/iewp_forms/forms_admin') ?>" data-apikey="<?php echo get_option( 'iewp_forms_apikey', '' ); ?>">
						</td>
					</tr>

                    <tr>
						<th scope="row">Required fields</th>
						<td>
							<input type="text" class="regular-text iewp-form-required-field-input" value="" id="iewp-form-required-field-input" autocomplete="off">
                            <button id="iewp-forms-add-required-field-button" class="button iewp-forms-add-required-field-button">Add</button>
                            <p class="description">Add the names of any required fields.</p>
                            <ul id="required-fields-list" class="required-fields-list iewp-form-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (to:)</th>
						<td>
							<input type="text" class="regular-text iewp-form-to-recipients-input" value="" id="iewp-form-to-recipients-input" autocomplete="off">
                            <button id="iewp-forms-add-to-recipients-button" class="button iewp-forms-add-to-recipients-button">Add</button>
                            <p class="description">Email addresses to send results to.</p>
                            <ul id="to-recipients-list" class="to-recipients-list iewp-form-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (cc:)</th>
						<td>
							<input type="text" class="regular-text iewp-form-cc-recipients-input" value="" id="iewp-form-cc-recipients-input" autocomplete="off">
                            <button id="iewp-forms-add-cc-recipients-button" class="button iewp-forms-add-cc-recipients-button">Add</button>
                            <p class="description">Email addresses to CC results to.</p>
                            <ul id="cc-recipients-list" class="cc-recipients-list iewp-form-list"></ul>
						</td>
					</tr>

                    <tr>
						<th scope="row">Recipients (bcc:)</th>
						<td>
							<input type="text" class="regular-text iewp-form-bcc-recipients-input" value="" id="iewp-form-bcc-recipients-input" autocomplete="off">
                            <button id="iewp-forms-add-bcc-recipients-button" class="button iewp-forms-add-bcc-recipients-button">Add</button>
                            <p class="description">Email addresses to BCC results to.</p>
                            <ul id="bcc-recipients-list" class="bcc-recipients-list iewp-form-list"></ul>
						</td>
					</tr>

				</tbody>
			</table>
		</div>

        <p>
			<button id="iewp-form-save-form" class="button button-primary button-large" disabled="disabled">Save Form</button>
		</p>

	</div>
	<?php
}
