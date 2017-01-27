(function(global) {

  var ngVer = '@2.0.2';
  var  map = {
    'app':                        'src', // 'dist',
    'rxjs':                       'https://npmcdn.com/rxjs@5.0.0-beta.6',
    'angular2-in-memory-web-api': 'https://npmcdn.com/angular2-in-memory-web-api' // get latest
  };
  var packages = {
    'app':                        { main: 'main.ts',  defaultExtension: 'ts' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
  };

  var packageNames = [
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/http',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/testing',
      '@angular/upgrade',
      '@angular/forms',
  ];

  packageNames.forEach(function(pkgName) {
    map[pkgName] = 'https://npmcdn.com/' + pkgName + ngVer;
  });

  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });
  
  map['@angular/router'] = 'https://npmcdn.com/@angular/router@3.0.2';
  packages['@angular/router'] = { main: 'index.js', defaultExtension: 'js' };
  
  map['codemirror'] = 'https://npmcdn.com/codemirror@5.16.0';
  packages['codemirror'] = { main: 'lib/codemirror.js', defaultExtension: 'js' };
  
  map['ng2-codemirror'] = 'https://npmcdn.com/ng2-codemirror@1.0.1';
  packages['ng2-codemirror'] = { main: 'lib/Codemirror.js', defaultExtension: 'js' };

  var config = {
    transpiler: 'typescript',
    typescriptOptions: {
      emitDecoratorMetadata: true
    },
    map: map,
    packages: packages
  }

  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);