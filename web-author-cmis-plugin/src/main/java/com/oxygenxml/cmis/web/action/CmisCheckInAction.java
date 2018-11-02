package com.oxygenxml.cmis.web.action;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.log4j.Logger;

public class CmisCheckInAction {

	private static final Logger logger = Logger.getLogger(CmisCheckInAction.class.getName());

	private static final String MAJOR_STATE = "major";

	/**
	 * Check in the last version of document.
	 * 
	 * @param document
	 * @param session The CMIS session.
	 * @param actualState
	 * @param commitMessage
	 * @throws Exception
	 */
	public static void checkInDocument(Document document, Session session, String actualState,
			String commitMessage) throws Exception {

		if (!document.isVersionSeriesCheckedOut()) {
			logger.info("Document isn't checked-out!");

		} else {
			document = document.getObjectOfLatestVersion(false);
			String pwc = document.getVersionSeriesCheckedOutId();

			if (pwc != null) {
				Document PWC = (Document) session.getObject(pwc);

				if (commitMessage == null || commitMessage == "null") {
					commitMessage = "";
				}

				if (actualState.equals(MAJOR_STATE)) {
					PWC.checkIn(true, null, null, commitMessage);
				} else {
					PWC.checkIn(false, null, null, commitMessage);
				}
			}

			document.refresh();
			logger.info(document.getName() + " checked-out: " + document.isVersionSeriesCheckedOut());
		}
	}
}
