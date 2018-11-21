/**
 * Action that displays the document's older versions in a dialog.
 *
 * @param editor the current editor.
 */
listOldVersionsAction = function(editor) {
  sync.actions.AbstractAction.call(this, '');
  this.editor_ = editor;
  this.dialog_ = null;
};
goog.inherits(listOldVersionsAction, sync.actions.AbstractAction);

/** @override */
listOldVersionsAction.prototype.getDisplayName = function() {
  return tr(msgs.ALL_VERSIONS_);
};

/** @override */
listOldVersionsAction.prototype.getSmallIcon = function(devicePixelRation) {
  return 'http://icons.iconarchive.com/icons/icons8/windows-8/256/Data-View-Details-icon.png';
};

/** @override */
listOldVersionsAction.prototype.actionPerformed = function(callback) {
  // Check if the server supports Commit Message.
  var supportsCommitMessage = !(document.querySelector('[data-root="true"]').getAttribute('data-pseudoclass-nosupportfor') === 'true');

  var allVerDialog = this.getDialog_(supportsCommitMessage);
  allVerDialog.show();

  allVerDialog.onSelect(function(e) {
    callback();
  });

  this.editor_.getActionsManager().invokeOperation(
    'com.oxygenxml.cmis.web.action.CmisOldVersions', {
      action: 'listOldVersions'
    }, goog.bind(this.handleOperationResult_, this, allVerDialog.getElement(), supportsCommitMessage));
};

/**
 * Creates the versions display dialog.
 *
 * @param supportsCommitMessage if the server supports Private Working Copy and commit messages.
 * @return the versions display dialog.
 * @private
 */
listOldVersionsAction.prototype.getDialog_ = function(supportsCommitMessage) {
  var allVerDialog = this.dialog_;
  if(!allVerDialog) {
    allVerDialog = workspace.createDialog();
    allVerDialog.setTitle(tr(msgs.ALL_VERSIONS_));
    allVerDialog.setButtonConfiguration(sync.api.Dialog.ButtonConfiguration.CANCEL);
    this.dialog_ = allVerDialog;
  } else {
    // Clear the dialog element to render the new versions table.
    goog.dom.removeChildren(allVerDialog.getElement());
  }

  if (supportsCommitMessage) {
    allVerDialog.setPreferredSize(750, 550);
    allVerDialog.setResizable(true);
  } else {
    allVerDialog.setPreferredSize(430, 500);
  }
  var loader = document.createElement('div');
  loader.setAttribute('id', 'cmis-loader');
  allVerDialog.getElement().appendChild(loader);

  return allVerDialog;
};

/**
 * Handles the version information received from the operation.
 *
 * @param container the container in which to display the versions.
 * @param supportsCommitMessage whether the server supports private working copies.
 * @param err errors that appeared.
 * @param data the data.
 * @private
 */
listOldVersionsAction.prototype.handleOperationResult_ = function(container, supportsCommitMessage, err, data) {
  // remove selection from document.
  document.activeElement.blur();

  // Commit message column might not be available on some servers.
  var versionHeader = this.createHeaderCell_(tr(msgs.VERSION_));
  var userHeader = this.createHeaderCell_(tr(msgs.MODIFIED_BY_));
  var commitHeader = supportsCommitMessage ? this.createHeaderCell_(tr(msgs.COMMIT_MESS_)) : '';

  container.querySelector("#cmis-loader").remove();

  var jsonFile = JSON.parse(data);
  goog.dom.append(container,
    goog.dom.createDom('div', { id: 'cmis-head' },
      versionHeader,
      userHeader,
      commitHeader
    ),
    this.createTable_(jsonFile, supportsCommitMessage)
  );

  this.resizeHeaderWidth_(versionHeader, 'version');
  this.resizeHeaderWidth_(userHeader, 'user');
  this.resizeHeaderWidth_(commitHeader, 'commit');

  // In case of older version, scroll it into view.
  var oldVersionSelected = document.querySelector('.current-version:not(:first-child)');
  if (oldVersionSelected) {
    oldVersionSelected.scrollIntoView(false);
  }
};

/**
 * Creates the versions table.
 *
 * @param jsonFile the versions descriptor.
 * @param supportsCommitMessage whether the server supports commit messages.
 *
 * @return {*} the HTML table.
 * @private
 */
listOldVersionsAction.prototype.createTable_ = function(jsonFile, supportsCommitMessage) {
  var table = goog.dom.createDom('table', { id: 'cmis-all-versions-table'});
  var isLatestVersionOpenedNow = location.href.indexOf('oldversion') === -1;

  for (var key in jsonFile) {
    if (key === 'filename') {
      continue;
    }

    var value = jsonFile[key];
    var versionUrlParamFromJson = value[0];

    var isThisVersionOpenedNow = window.location.search.indexOf(versionUrlParamFromJson) !== -1;
    var isThisVersionOld = versionUrlParamFromJson.indexOf('oldversion') !== -1;
    var isThisCurrentVersion = (isThisVersionOpenedNow && isThisVersionOld) || (isLatestVersionOpenedNow && !isThisVersionOld);

    var href = window.location.origin + window.location.pathname + versionUrlParamFromJson;
    var versionLink = goog.dom.createDom('a', {
        className: 'oldlink',
        href: isThisCurrentVersion ? '#' : href,
        target: '_blank'
      }, key);

    var versionTd = this.createTableCell_('version', versionLink);
    var userTd = this.createTableCell_('user', value[2]);
    // If file is not versionable, do not create the commit cell.
    var commitTd = supportsCommitMessage ? this.createTableCell_('commit', value[1]) : '';

    // Fill the dialog with only version/user columns.
    if (!supportsCommitMessage) {
      versionTd.style.width = '150px';
      userTd.style.width = '60%';
    }

    table.appendChild(goog.dom.createDom('tr', {className: isThisCurrentVersion ? 'current-version' : ''},
      versionTd,
      userTd,
      commitTd
    ));
  }
  return table;
};

/**
 * Creates a table header cell.
 *
 * @param text the cells text content.
 * @return {*} the header cell element.
 * @private
 */
listOldVersionsAction.prototype.createHeaderCell_ = function(text) {
  return goog.dom.createDom('div', 'headtitle', text);
};

/**
 * Create cell element.
 *
 * @param customAttribute custom attribute.
 * @param textContent the cells text content.
 * @return {*} the cell.
 * @private
 */
listOldVersionsAction.prototype.createTableCell_ = function(customAttribute, textContent) {
  var cell = goog.dom.createDom('td', 'td', textContent ? textContent : '');
  // Set some data attributes to set the column header widths later.
  goog.dom.dataset.set(cell, customAttribute, customAttribute);
  return cell;
};

/**
 * Resize the header cell accordingly to it's cells.
 *
 * @param header the header cell
 * @param attr the cell type.
 * @private
 */
listOldVersionsAction.prototype.resizeHeaderWidth_ = function(header, attr) {
  if (header) {
    var tableCell = document.querySelector('[data-' + attr + '="' + attr + '"]');
    var headerSectionWidth;
    if(tableCell) {
      headerSectionWidth = tableCell.offsetWidth;
    } else {
      // no entries in table.
      var headerContainer = header.parentElement;
      headerSectionWidth = headerContainer.offsetWidth / headerContainer.children.length;
    }
    header.style.width = headerSectionWidth + 'px';
  }
};
