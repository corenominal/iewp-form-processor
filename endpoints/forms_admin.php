<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

function iewp_forms_admin( $request_data )
{

    $apikey = get_option( 'iewp_forms_apikey', '' );

    $data = $request_data->get_params();

    /**
	 * Test for api key action
	 */
    if( !isset( $data['apikey'] ) || $data['apikey'] !== $apikey || $data['apikey'] === '' )
    {
        $data['error'] = 'Invalid API key';
        return $data;
    }

    /**
	 * Test for action
	 */
	if( !isset( $data['action'] ) )
 	{
 		$data['error'] = 'Please provide an action';
 		return $data;
 	}

    switch ( $data['action'] )
	{
		case 'list_forms':
			global $wpdb;
			$sql = "SELECT iewp_forms.id, name, FROM_UNIXTIME( iewp_forms.date_created, '%D %M %Y' ) AS created, COUNT(form_id) AS submissions
                      FROM iewp_forms LEFT JOIN iewp_form_submissions
                        ON iewp_forms.id = iewp_form_submissions.form_id
                     GROUP BY iewp_forms.id
                     ORDER BY iewp_forms.id DESC;";
			$data['forms'] = $wpdb->get_results( $sql, ARRAY_A );
			$data['num_rows'] = $wpdb->num_rows;
			unset( $data['action'] );
			unset( $data['apikey'] );
			return $data;
			break;

        case 'delete_form':
            global $wpdb;
			$wpdb->delete( 'iewp_forms', array( 'id' => $data['id'] ), array( '%d' ) );
            $wpdb->delete( 'iewp_form_submissions', array( 'form_id' => $data['id'] ), array( '%d' ) );

			unset( $data['action'] );
			unset( $data['apikey'] );
			return $data;
			break;

        case 'create_form':
            if( !isset( $data['name'] ) || empty( $data['name'] ) )
            {
                $data['error'] = 'Please provide a name for the form';
                return $data;
            }
            global $wpdb;
    		$sql = "SELECT * FROM iewp_forms
    				WHERE name = '" . $data['name'] . "';";
    		$result = $wpdb->get_results( $sql, ARRAY_A );

    		if( $wpdb->num_rows > 0 )
            {
                $data['error'] = 'Name already in use, try another';
                return $data;
            }
            unset( $data['action'] );
			unset( $data['apikey'] );
            $wpdb->insert( 'iewp_forms',
                array( 'form' => sha1( $data['name'] . microtime() ),
                       'name' => $data['name'],
                       'required_fields' => '[]',
                       'to_recipients' => '[]',
                       'cc_recipients' => '[]',
                       'bcc_recipients' => '[]',
                       'options' => '[]',
                       'date_created' => time()
                ),
                array( '%s', '%s', '%s', '%s', '%s', '%s', '%d' )
            );
            $data['id'] = $wpdb->insert_id;
			return $data;
			break;

        case 'get_form':
            global $wpdb;
			$sql = "SELECT * FROM iewp_forms WHERE id = " . $data['form'];
            $data['form'] = $wpdb->get_row( $sql, ARRAY_A );
            if( $wpdb->num_rows == 0 )
            {
                $data['error'] = 'Could not find form';
                return $data;
            }
			unset( $data['action'] );
			unset( $data['apikey'] );
			return $data;
			break;

        case 'save_form':
            global $wpdb;

            if( trim( $data['name'] ) == '' )
            {
                $data['name'] = 'Untitled form ' . $data['id'];
            }

            $wpdb->update( 'iewp_forms', // table
                           array( 'name' => $data['name'],
                                  'required_fields' => $data['required_fields'],
                                  'to_recipients' => $data['to_recipients'],
                                  'cc_recipients' => $data['cc_recipients'],
                                  'bcc_recipients' => $data['bcc_recipients'] ), // data
                           array( 'id' => $data['id'] ), // where
                           array( '%s', '%s', '%s', '%s', '%s' ), // data format
                           array( '%d' ) // where format
                         );

			unset( $data['action'] );
			unset( $data['apikey'] );
			return $data;
			break;

		default:
			$data['error'] = 'Please provide a valid action';
			return $data;
			break;
	}

}
