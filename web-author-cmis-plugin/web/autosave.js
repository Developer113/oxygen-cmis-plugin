(function() {
  /** BEFORE_EDITOR_LOADED */
  goog.events.listen(workspace, sync.api.Workspace.EventType.BEFORE_EDITOR_LOADED, function(e) {
    var urlAutoSaveInterval = sync.util.getURLParameter('autoSaveInterval');
    // The url auto save interval should override the one set in the admin page
    if(!urlAutoSaveInterval) {
      var autoSaveInterval = parseInt(sync.options.PluginsOptions.getClientOption('cmis.autosave_interval'));
      if (e.options.url.match('cmis')) {
        e.options.autoSaveInterval = autoSaveInterval;
      }
    }
  });
})();
