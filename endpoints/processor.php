<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }

function iewp_forms_processor( $request_data )
{
    global $wpdb;

    $data = $request_data->get_params();

    /**
     * TODO nonce test
     */

    /**
     * Test the form exists
     */
    if( !isset( $data['form'] ) || trim( $data['form'] ) == '' )
    {
        $data['error'] = 'No form data present.';
        return $data;
    }
    else
    {
        $sql = "SELECT * FROM iewp_forms WHERE form = '" . $data['form'] . "'";
        $form = $wpdb->get_row( $sql, ARRAY_A );

        if( $wpdb->num_rows === 0 )
        {
            $data['error'] = 'Form not found.';
            return $data;
        }
    }

    /**
     * Test for required fields
     */
    $required_fields = json_decode( $form['required_fields'] );

    foreach ( $required_fields as $required )
    {
        if( !isset( $data[$required] ) || trim( $data[$required] ) === '' )
        {
            $data['error'] = 'Required field "' . $required . '" missing.';
            return $data;
        }
    }

    /**
     * Test for valid email address, if $data['email'] is provided
     */
    if( isset( $data['email'] ) )
    {
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) === true)
        {
            $data['error'] = 'Please provide a valid email address';
            return $data;
        }
    }

    /**
     * Insert data into submissions table
     */
    unset( $data['form'] );
    $wpdb->insert( 'iewp_form_submissions',
        array( 'form_id' => $form['id'],
               'data' => json_encode( $data ),
               'ip' => $_SERVER['REMOTE_ADDR'],
               'date_created' => time()
        ),
        array( '%d', '%s', '%s', '%d' )
    );
    $id = $wpdb->insert_id;

    /**
     * Send email, if required
     */
    $to = json_decode( $form['to_recipients'] );
    if( count( $to ) > 0 )
    {
        $subject = get_bloginfo( 'name' ) . ': form submission';

        $message  = 'Form submission from website: ' . get_bloginfo( 'name' ) . "\r\n";
        $message .= 'Submitted on: ' . date('l jS \of F Y H:i:s') . "\r\n";
        $message .= ".\r\n\r\n";

        foreach ($data as $key => $value)
        {
            $message .= $key . ': ' . $value . "\r\n\r\n";
        }

        $headers = array();

        $cc_recipients = json_decode( $form['cc_recipients'] );
        if( count( $cc_recipients ) > 0 )
        {
            foreach ( $cc_recipients as $cc )
            {
                $headers[] = 'Cc: ' . $cc;
            }
        }

        $bcc_recipients = json_decode( $form['bcc_recipients'] );
        if( count( $bcc_recipients ) > 0 )
        {
            foreach ( $bcc_recipients as $bcc )
            {
                $headers[] = 'Bcc: ' . $bcc;
            }
        }

        wp_mail( $to, $subject, $message, $headers );
    }

    return $data;
}
