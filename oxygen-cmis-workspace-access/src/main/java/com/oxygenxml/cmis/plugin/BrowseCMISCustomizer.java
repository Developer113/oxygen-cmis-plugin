package com.oxygenxml.cmis.plugin;

import java.awt.event.ActionEvent;
import java.net.URL;
import java.util.List;

import javax.swing.AbstractAction;
import javax.swing.Action;
import javax.swing.ImageIcon;
import javax.swing.JFrame;

import ro.sync.exml.workspace.api.standalone.InputURLChooser;
import ro.sync.exml.workspace.api.standalone.InputURLChooserCustomizer;

/**
 * Contributes CMIS related actions to the URL choosers.
 */
public class BrowseCMISCustomizer implements InputURLChooserCustomizer {
  private final Action browseAction;
  private InputURLChooser inputUrlChooser;

  /**
   * Constructor.
   * 
   * @param frame Application frame. Used as parent for all the fialogs presented by the actions.
   */
  public BrowseCMISCustomizer(JFrame frame) {
    String browseCmis = TranslationResourceController.getMessage(Tags.BROWSE_CMIS);

    URL urlIcon = getClass().getClassLoader().getResource("images/cmis.png");
    browseAction = new AbstractAction(browseCmis, new ImageIcon(urlIcon)) {
      @Override
      public void actionPerformed(ActionEvent e) {
        new CmisDialog(frame, inputUrlChooser, true);

      }
    };

  }

  @Override
  public void customizeBrowseActions(List<Action> existingBrowseActions, InputURLChooser chooser) {
    this.inputUrlChooser = chooser;
    existingBrowseActions.add(browseAction);
  }
}
