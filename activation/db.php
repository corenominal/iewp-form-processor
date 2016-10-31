<?php
if ( ! defined( 'WPINC' ) ) { die('Direct access prohibited!'); }
/**
 * Set-up database tables.
 */
function iewp_form_processor_create_tables()
{
	global $wpdb;

	$sql = "CREATE TABLE IF NOT EXISTS `iewp_forms` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `name` varchar(255) NOT NULL DEFAULT '',
              `required_fields` varchar(255) NOT NULL DEFAULT '',
              `to_recipients` varchar(255) NOT NULL DEFAULT '',
              `cc_recipients` varchar(255) NOT NULL DEFAULT '',
              `bcc_recipients` varchar(255) NOT NULL DEFAULT '',
			  `options` text NOT NULL DEFAULT '',
			  `date_created` int(11) NOT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
	$query = $wpdb->query( $sql );

	$sql = "CREATE TABLE IF NOT EXISTS `iewp_form_submissions` (
			  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
			  `form_id` int(11) NOT NULL,
			  `data` text NOT NULL DEFAULT '',
			  `date_created` int(11) NOT NULL,
			  PRIMARY KEY (`id`),
			  KEY `form_id` (`form_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
	$query = $wpdb->query( $sql );
}

iewp_form_processor_create_tables();
