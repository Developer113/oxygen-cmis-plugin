package com.oxygenxml.cmis.web;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;

import com.oxygenxml.cmis.core.CMISAccess;
import com.oxygenxml.cmis.core.ResourceController;
import com.oxygenxml.cmis.web.action.CmisCheckOutAction;

public class CmisActionsCancelCheckOutIT {
  
  @Rule
  public CmisAccessProvider cmisAccessProvider = new CmisAccessProvider();
	/**
	 * Executes operations over the resources.
	 */
	private ResourceController ctrl;

	@Before
	public void setUp() throws Exception {
		CMISAccess cmisAccess = cmisAccessProvider.getCmisAccess();
    ctrl = cmisAccess.createResourceController();
	}

	@Test
	public void testCancelCheckOut() throws Exception {
	  Document document = null;
	  try {
      document = ctrl.createVersionedDocument(ctrl.getRootFolder(), "cancel", "empty", "plain/xml",
				"VersionableType", VersioningState.MINOR);

			CmisCheckOutAction.checkOutDocument(document);

			assertNotNull(document);
			assertTrue(document.isVersionable());

			document = document.getObjectOfLatestVersion(false);
			assertTrue(document.isVersionSeriesCheckedOut());

			CmisCheckOutAction.cancelCheckOutDocument(document, cmisAccessProvider.getCmisAccess().getSession());

			document = document.getObjectOfLatestVersion(false);
			assertFalse(document.isVersionSeriesCheckedOut());
			
		} finally {
		  if (document != null) {
		    ctrl.deleteAllVersionsDocument(document);
		  }
		}
	}
}
