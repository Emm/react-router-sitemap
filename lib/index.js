import fs from 'fs';
import { createRoutes } from 'react-router';
import parseRoutes from './routes-parser';
import filterPaths from './paths-filter';
import applyParams from './params-applier';
import buildSitemap from './sitemap-builder';

/**
 * @class Sitemap
 * @description Generate sitemap by [React Router](https://www.npmjs.com/package/react-router) configuration.
 *
 * @example
 * import Sitemap from 'react-router-sitemap';
 *
 * const sitemap = (
 *   new Sitemap(<Route path='/home'>)
 *     .build('http://my-site.ru')
 *     .save("./sitemap.xml");
 * );
 */
class Sitemap {

	/**
	 * @constructor
	 * @description Convert React Router config to array of paths.
	 * @param {Route} router - React Router configuration.
	 *
	 * @example
	 * import Sitemap from 'react-router-sitemap';
	 *
	 * const sitemap = new Sitemap(<Route path='/home'>);
	 */
	constructor(router) {

		if (!router) {
			throw new Error('Need pass router in module');
		}

		const routes = createRoutes(router);

		this.paths = parseRoutes(routes);


		return this;

	}

	/**
	 * @description Filters path on the specified rules.
	 * @param {Object} filterConfig - Filter configuration
	 * @property {Array<RegExp>} rules - List filter rules.
	 * @property {Boolean} isValid - Flag that defines a way to filter paths.
	 * If `true`, the path satisfying the rules will be included.
	 * If `false`, the path satisfying the rules will be excluded.
	 *
	 * @example
	 * <caption>Config for exclude `/auth` and `/thanks`</caption>
	 * { isValid: false, rules: [/\/auth/, /\/thanks/] }
	 *
	 * @example
	 * <caption>Config for include `/auth` and `/thanks`</caption>
	 * { isValid: true, rules: [/\/auth/, /\/thanks/] }
	 */
	filterPaths(filterConfig) {

		this.paths = filterPaths(
			this.paths,
			filterConfig.rules,
			filterConfig.isValid || false
		);

		return this;

	}

	/**
	 * @description Replaces the dynamic parameters in paths the passed value.
	 * @param {Object.<String, Array>} paramsConfig - Configuration for replace params.
	 *
	 * @example
	 * <caption>Config for replace params `:param` in path `/path/:param`</caption>
	 * {
	 *   '/path/:param': [
	 *     { param: 'value' }
	 *   ]
	 * }
	 *
	 * @example
	 * <caption>Config for replace params `:param` and `:subparam`
	 * in path `/path/:param/:subparam`</caption>
	 * {
	 *   '/path/:param/:subparam': [
	 *     { param: 'value', subparam: ['subvalue1', 'subvalue2'] }
	 *   ]
	 * }
	 *
	 */
	applyParams(paramsConfig) {
		this.paths = applyParams(this.paths, paramsConfig);
		return this;
	}

	/**
	 * @description Convert array of paths to sitemap.
	 * @param {String} hostname - The root name of your site.
	 */
	build(hostname) {
		this.sitemap = buildSitemap(hostname, this.paths);
		return this;
	}

	/**
	 * @description Save sitemap in file.
	 * @param {String} dist - The path and file name where the sitemap is saved.
	 */
	save(dist) {
		fs.writeFileSync(dist, this.sitemap.toString());
		return this;
	}

}

export default Sitemap;

export { routesParser } from './routes-parser';
export { pathsFilter } from './paths-filter';
export { paramsApplier } from './params-applier';
export { sitemapBuilder } from './sitemap-builder';
