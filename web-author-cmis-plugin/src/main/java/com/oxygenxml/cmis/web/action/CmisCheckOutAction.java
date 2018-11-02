package com.oxygenxml.cmis.web.action;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.log4j.Logger;

public class CmisCheckOutAction {

	private static final Logger logger = Logger.getLogger(CmisCheckOutAction.class.getName());

	/**
	 * Check out the last version of document.
	 * 
	 * @param document
	 * @throws Exception
	 */
	public static void checkOutDocument(Document document) throws Exception {

		document = document.getObjectOfLatestVersion(false);

		if (document.isVersionSeriesCheckedOut()) {
			logger.info("Document is checked-out!");

		} else {
			document.checkOut();
			document.refresh();
			logger.info(document.getName() + " checked-out: " + document.isVersionSeriesCheckedOut());
		}
	}

	/**
	 * Get the last version and cancel check-out.
	 * 
	 * @param document
	 * @param session The CMIS session.
	 * @throws Exception
	 */
	public static void cancelCheckOutDocument(Document document, Session session) throws Exception {

		if (!document.isVersionSeriesCheckedOut()) {
			logger.info("Document isn't checked-out!");
			
		} else {
			document = document.getObjectOfLatestVersion(false);
			String pwc = document.getVersionSeriesCheckedOutId();

			if (pwc != null) {
        Document PWC = (Document) session.getObject(pwc);
				PWC.cancelCheckOut();
			}

			document.refresh();
			logger.info(document.getName() + " checked-out: " + document.isVersionSeriesCheckedOut());
		}

	}
}
