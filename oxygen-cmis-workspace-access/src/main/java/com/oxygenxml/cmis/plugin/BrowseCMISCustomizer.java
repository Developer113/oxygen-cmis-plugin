package com.oxygenxml.cmis.plugin;

import java.awt.event.ActionEvent;
import java.net.URL;
import java.util.List;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.ImageIcon;
import javax.swing.JFrame;

import org.apache.log4j.Logger;

import ro.sync.exml.workspace.api.standalone.InputURLChooser;
import ro.sync.exml.workspace.api.standalone.InputURLChooserCustomizer;

public class BrowseCMIS implements InputURLChooserCustomizer {
  // Get the workspace of the plugin

  private final Action browseAction;
  private InputURLChooser inputUrlChooser;
  /**
   * Logging.
   */
  private static final Logger logger = Logger.getLogger(BrowseCMIS.class);

  BrowseCMIS(JFrame frame) {
    String browseCmis = TranslationResourceController.getMessage("BROWSE_CMIS");
    String cmisDialog = TranslationResourceController.getMessage("CMIS_DIALOG");

    URL urlIcon = getClass().getClassLoader().getResource("images/cmis.png");
    browseAction = new AbstractAction(browseCmis, new ImageIcon(urlIcon)) {

      @Override
      public void actionPerformed(ActionEvent e) {
        new CmisDialog(frame, cmisDialog, inputUrlChooser, true);

      }
    };

  }

  @Override
  public void customizeBrowseActions(List<Action> existingBrowseActions, InputURLChooser chooser) {

    this.inputUrlChooser = chooser;
    existingBrowseActions.add(browseAction);
  }

}
