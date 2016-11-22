<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

/**
 * Enqueue additional JavaScript and CSS
 */
function iewp_forms_submission_scripts( $hook )
{

	if( 'forms_page_iewp_forms_submissions' != $hook )
	{
		return;
	}

	add_thickbox();

	wp_register_style( 'iewp_forms_submissions_css', plugin_dir_url( __FILE__ ) . 'css/iewp_forms_submissions.css', array(), '0.0.1', 'all' );
	wp_enqueue_style( 'iewp_forms_submissions_css' );

	wp_register_script( 'iewp_forms_submissions_js', plugin_dir_url( __FILE__ ) . 'js/iewp_forms_submissions.js', array('jquery'), '0.0.1', true );
	wp_enqueue_script( 'iewp_forms_submissions_js' );

}
add_action( 'admin_enqueue_scripts', 'iewp_forms_submission_scripts' );

/**
 * Output HTML
 */
function iewp_forms_submissions_callback()
{
	?>
	<div class="wrap">

		<h1>IEWP Forms  &mdash; Submissions</h1>

		<?php
		if( isset( $_GET['name'] ) && !empty( $_GET['name'] )  )
		{
			echo '<p>Data captured from your form: <strong>' . $_GET['name'] . '</strong></p>';
		}
		else
		{
			echo '<p>Data captured from your forms.</p>';
		}
		?>

		<div class="tablenav top">
			<div class="alignleft actions">
				<button class="iewp-forms-remove-selected-subs button" disabled="disabled">Remove Selected</button>
				<button class="iewp-forms-remove-all-subs button" disabled="disabled">Remove All</button>
			</div>
			<div class="tablenav-pages">
				<span class="displaying-num"></span>
				<span class="pagination-links">
					<button class="tablenav-pages-navspan button page-first" aria-hidden="true">&laquo;</button>
					<button class="tablenav-pages-navspan button page-prev" aria-hidden="true">&lsaquo;</button>
					<span class="paging-input"><label for="current-page-selector" class="screen-reader-text">Current Page</label><span class="current-page">0</span><span class="tablenav-paging-text"> of <span class="total-pages">0</span></span></span>
					<button class="tablenav-pages-navspan button page-next" aria-hidden="true">&rsaquo;</button>
					<button class="tablenav-pages-navspan button page-last" aria-hidden="true">&raquo;</button>
				</span>
			</div>
		</div>

		<table id="iewp-forms-submissions" class="submissions-list updates-table wp-list-table widefat fixed striped posts"
		       data-offset="0"
			   <?php
			   $form = 'all';
			   if( isset( $_GET['form'] ) && is_numeric( $_GET['form'] )  )
			   {
				   $form = $_GET['form'];
			   }
			   ?>
			   data-form="<?php echo $form ?>"
			   data-limit="20"
			   data-pages="0"
			   data-total="0"
			   data-endpoint="<?php echo site_url('wp-json/iewp_forms/forms_admin') ?>"
			   data-apikey="<?php echo get_option( 'iewp_forms_apikey', '' ); ?>"
		>
        	<thead>
        		<tr>
					<td class="manage-column column-cb check-column" scope="col"><input id="iewp-forms-checkall-subs" class="iewp-forms-checkall-subs" type="checkbox" value=""></td>
					<th class="manage-column column-name column-primary" scope="col">Form</th>
					<th class="manage-column column-created" scope="col">Date Submitted</th>
        			<th class="manage-column column-options" scope="col">IP Address</th>
        		</tr>
        	</thead>

        	<tbody id="the-list">
        		<tr class="iewp-forms-no-subs"><th colspan="4">Loading submissions ...</th></tr>
        	</tbody>
        </table>

		<div class="tablenav bottom">
			<div class="alignleft actions">
				<button class="iewp-forms-remove-selected-subs button" disabled="disabled">Remove Selected</button>
				<button class="iewp-forms-remove-all-subs button" disabled="disabled">Remove All</button>
			</div>
			<div class="tablenav-pages">
				<span class="displaying-num"></span>
				<span class="pagination-links">
					<button class="tablenav-pages-navspan button page-first" aria-hidden="true">&laquo;</button>
					<button class="tablenav-pages-navspan button page-prev" aria-hidden="true">&lsaquo;</button>
					<span class="paging-input"><label for="current-page-selector" class="screen-reader-text">Current Page</label><span class="current-page">0</span><span class="tablenav-paging-text"> of <span class="total-pages">0</span></span></span>
					<button class="tablenav-pages-navspan button page-next" aria-hidden="true">&rsaquo;</button>
					<button class="tablenav-pages-navspan button page-last" aria-hidden="true">&raquo;</button>
				</span>
			</div>
		</div>

		<div id="iewp-forms-notify-remove-selected">
			<h3>Remove Selected</h3>
			<p><strong>Are you sure?</strong> This action cannot be undone.</p>
			<p>
				<button id="iewp-forms-confirm-remove-selected-subs" class="button">Yes</button>
				<button class="button iewp-thickbox-dismiss-button">No</button>
			</p>
		</div>

		<div id="iewp-forms-notify-remove-all">
			<h3>Remove All</h3>
			<p><strong>Are you sure?</strong> This action cannot be undone.</p>
			<p>
				<button id="iewp-forms-confirm-remove-all-subs" class="button">Yes</button>
				<button class="button iewp-thickbox-dismiss-button">No</button>
			</p>
		</div>

	</div>
	<?php
}
